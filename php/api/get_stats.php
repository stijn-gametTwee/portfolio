<?php
// php/api/get_stats.php
// Simple endpoint: GET ?placeId=123456
// Returns JSON: { placeId, universeId, visits, playing } or { error: '...' }

// Basic headers
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// sanitize
$placeId = isset($_GET['placeId']) ? preg_replace('/[^0-9]/', '', $_GET['placeId']) : null;
if (!$placeId) {
    http_response_code(400);
    echo json_encode(['error' => 'missing_placeId']);
    exit;
}

// cache config
$root = __DIR__ . '/../../';
$cacheDir = $root . 'php_cache';
if (!is_dir($cacheDir)) @mkdir($cacheDir, 0755, true);
$cacheFile = $cacheDir . '/place_' . $placeId . '.json';
$cacheTtl = 60; // seconds

// serve cache if fresh
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    echo file_get_contents($cacheFile);
    exit;
}

// Helper to fetch url with a small timeout
function fetch_url($url) {
    $opts = [
        'http' => [
            'method' => 'GET',
            'timeout' => 5,
            'header' => "User-Agent: StijnPortfolio/1.0\r\nAccept: application/json\r\n"
        ]
    ];
    $context = stream_context_create($opts);
    return @file_get_contents($url, false, $context);
}

// Step 1: get place details (to discover universeId)
$placeUrl = "https://games.roblox.com/v1/games/multiget-place-details?placeIds={$placeId}";
$placeResp = fetch_url($placeUrl);
if ($placeResp === false) {
    echo json_encode(['error' => 'fetch_failed_place']);
    exit;
}
$placeData = json_decode($placeResp, true);
if (!$placeData || !isset($placeData[0])) {
    echo json_encode(['error' => 'invalid_place_response']);
    exit;
}
$info = $placeData[0];
$universeId = null;
if (isset($info['universeId'])) {
    $universeId = $info['universeId'];
} elseif (isset($info['universe']) && isset($info['universe']['id'])) {
    $universeId = $info['universe']['id'];
}

// Step 2: if universeId available, query games endpoint for stats
$visits = null; $playing = null;
if ($universeId) {
    $gamesUrl = "https://games.roblox.com/v1/games?universeIds={$universeId}";
    $gamesResp = fetch_url($gamesUrl);
    if ($gamesResp !== false) {
        $g = json_decode($gamesResp, true);
        if (isset($g['data'][0])) {
            $visits = isset($g['data'][0]['visits']) ? intval($g['data'][0]['visits']) : null;
            $playing = isset($g['data'][0]['playing']) ? intval($g['data'][0]['playing']) : null;
        }
    }
}

// assemble output
$out = [
    'placeId'   => intval($placeId),
    'universeId'=> $universeId ? intval($universeId) : null,
    'visits'    => $visits,
    'playing'   => $playing
];

// write cache (best effort)
@file_put_contents($cacheFile, json_encode($out));

// output
echo json_encode($out);
