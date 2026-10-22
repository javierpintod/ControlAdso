<?php
declare(strict_types=1);

require_once __DIR__ . '/../factories/AssetFactoryProducer.php';

echo "=========================================================\n";
echo "PRUEBA DEL PATRÓN FÁBRICA ABSTRACTA (ControlAdso SENA)\n";
echo "=========================================================\n\n";

$testCases = [
    [
        'category' => 'cat-comp',
        'data' => [
            'placa' => '95271099001',
            'serial' => 'SN-HP-G6-001',
            'descripcion' => 'COMPUTADOR PORTATIL PROBOOK 445R',
            'modelo' => 'PROBOOK 445R',
            'descripcion_actual' => 'Portátil para desarrollo ADSO',
            'category_id' => 'cat-comp',
            'category_name' => 'Laptops & Estaciones Móviles',
            'environment_id' => 'amb2',
            'environment_name' => 'Ambiente 2: Aula Computo & Redes ADSO',
            'valor_ingreso' => '$3.500.000,00'
        ]
    ],
    [
        'category' => 'cat-clim',
        'data' => [
            'placa' => '95271099002',
            'serial' => 'SN-CS24A-002',
            'descripcion' => 'AIRE ACONDICIONADO MINI SPLIT CS-24A',
            'modelo' => 'CS-24A',
            'descripcion_actual' => 'Aire acondicionado 24000 BTU',
            'category_id' => 'cat-clim',
            'category_name' => 'Climatización & Aires Acondicionados',
            'environment_id' => 'amb1',
            'environment_name' => 'Ambiente 1: Lab Robotica e IA',
            'valor_ingreso' => '$4.200.000,00'
        ]
    ],
    [
        'category' => 'cat-robt',
        'data' => [
            'placa' => '95271099003',
            'serial' => 'SN-ARM6-003',
            'descripcion' => 'BRAZO ROBOTICO 6-DOF OPENMANIPULATOR',
            'modelo' => 'OPENMANIPULATOR-X',
            'descripcion_actual' => 'Brazo robótico para visión artificial',
            'category_id' => 'cat-robt',
            'category_name' => 'Robots Educativos & Brazos 6-DOF',
            'environment_id' => 'amb1',
            'environment_name' => 'Ambiente 1: Lab Robotica e IA',
            'valor_ingreso' => '$12.000.000,00'
        ]
    ],
    [
        'category' => 'cat-mob',
        'data' => [
            'placa' => '95271099004',
            'serial' => 'SN-ERG-004',
            'descripcion' => 'SILLA ERGONOMICA EN MALLA',
            'modelo' => 'ERG-300',
            'descripcion_actual' => 'Silla ergonómica giratoria con brazos',
            'category_id' => 'cat-mob',
            'category_name' => 'Mobiliario Ergonómico',
            'environment_id' => 'amb2',
            'environment_name' => 'Ambiente 2: Aula Computo & Redes ADSO',
            'valor_ingreso' => '$480.000,00'
        ]
    ]
];

$successCount = 0;

foreach ($testCases as $index => $test) {
    $catId = $test['category'];
    $data = $test['data'];

    echo "--- Caso #" . ($index + 1) . ": Categoría '{$catId}' ---\n";
    $factory = AssetFactoryProducer::getFactory($catId);
    echo "Fábrica resuelta: " . get_class($factory) . "\n";
    echo "Familia de activo: " . $factory->getFamilyName() . "\n";
    echo "Garantía estándar: " . $factory->getDefaultWarrantyYears() . " años\n";

    $asset = $factory->createAsset($data);
    echo "Producto instanciado: " . get_class($asset) . "\n";
    echo "ID generado: " . $asset->getId() . "\n";
    echo "Código QR: " . $asset->getQrToken() . "\n";
    echo "Garantía calculada hasta: " . $asset->getWarrantyUntil() . "\n";
    echo "Specs técnicas: " . json_encode($asset->getTechnicalSpecs(), JSON_UNESCAPED_UNICODE) . "\n";

    if ($asset instanceof AssetInterface) {
        echo "✅ PASS: Cumple contrato AssetInterface y pertenece a la familia correcta.\n\n";
        $successCount++;
    } else {
        echo "❌ FAIL: No implementa AssetInterface.\n\n";
    }
}

echo "RESULTADO FINAL: {$successCount} de " . count($testCases) . " pruebas superadas con éxito.\n";
