<?php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/auth.php';

requireRole('admin');

$db = getDB();
$id = trim($_GET['id'] ?? '');

if ($db && !empty($id)) {
    try {
        $stmt = $db->prepare("DELETE FROM assets WHERE id = ?");
        $stmt->execute([$id]);
    } catch (Exception $e) {
        // En caso de restricción de llave foránea, marcarlo como decomisado
        $stmt = $db->prepare("UPDATE assets SET physical_status = 'decomisado', status_label = 'Decomisado / Baja' WHERE id = ?");
        $stmt->execute([$id]);
    }
}

header('Location: assets.php?msg=deleted');
exit;
