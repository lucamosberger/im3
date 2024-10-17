<?php

// TEST API

// // Datenbankkonfiguration einbinden
// // require_once 'config.php';

// // Header setzen, um JSON-Inhaltstyp zurückzugeben
// header('Content-Type: application/json');

// try {
//     // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
//     $pdo = new PDO($dsn, $username, $password, $options);

//     // Datum aus der GET-Anfrage abrufen
//     if (isset($_GET['date'])) {
//         $date = $_GET['date'];

//         // SQL-Query, um Daten basierend auf dem ausgewählten Datum im Format tt.mm.yyyy auszuwählen
//         $sql = "SELECT * FROM `abgespacet_tabelle` WHERE `timestamp` LIKE ?";
        
//         // Bereitet die SQL-Anweisung vor
//         $stmt = $pdo->prepare($sql);

//         // Führt die Abfrage aus, indem das Datum übergeben wird
//         $stmt->execute(["%$date%"]);

//         // Holt alle passenden Einträge
//         $results = $stmt->fetchAll();

//         // Gibt die Ergebnisse im JSON-Format zurück
//         echo json_encode($results);
//     } else {
//         echo json_encode(['error' => 'Kein Datum angegeben.']);
//     }

// } catch (PDOException $e) {
//     // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
//     echo json_encode(['error' => $e->getMessage()]);
// }
?>
