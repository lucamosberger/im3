<?php

// Datenbankkonfiguration einbinden
require_once 'config.php';

// Header setzen, um JSON-Inhaltstyp zurückzugeben
header('Content-Type: application/json');

// Hole die Start- und Endzeit aus den GET-Parametern
$start = isset($_GET['start']) ? $_GET['start'] : null;
$end = isset($_GET['end']) ? $_GET['end'] : null;

// Debugging: Check if start and end are correctly received
if (!$start || !$end) {
    echo json_encode(['error' => 'Kein Datum angegeben.', 'received_start' => $start, 'received_end' => $end]);
    exit;
}

try {
    // Split the start and end into time and date components
    $startParts = explode(' ', $start);
    $endParts = explode(' ', $end);

    if (count($startParts) === 2 && count($endParts) === 2) {
        // Ergänze Sekunden, falls sie fehlen (z.B., wenn nur HH:MM gesendet wird)
        if (strlen($startParts[0]) === 5) { // Check if time is HH:MM
            $startParts[0] .= ":00"; // Add :00 for seconds
        }
        if (strlen($endParts[0]) === 5) { // Check if time is HH:MM
            $endParts[0] .= ":00"; // Add :00 for seconds
        }

        // Recombine the time and date parts
        $start = $startParts[0] . ' ' . $startParts[1];
        $end = $endParts[0] . ' ' . $endParts[1];
    }

    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query, um alle Daten ohne Einschränkung abzurufen
    $sql = "SELECT * FROM `abgespacet_tabelle`";
    
    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    // Führt die Abfrage aus
    $stmt->execute();

    // Holt alle Einträge
    $results = $stmt->fetchAll();

    // Wenn keine Start- und Endzeit vorhanden ist, gebe einfach alle Ergebnisse zurück
    if (!$start || !$end) {
        echo json_encode($results);
        exit;
    }

    // Array für die gefilterten Einträge
    $filteredResults = [];

    // Format für die Konvertierung der Strings aus der Datenbank
    $dbFormat = 'H:i:s d.m.Y';

    // Start- und Endzeit in DateTime-Objekte umwandeln
    $startDateTime = DateTime::createFromFormat($dbFormat, $start);
    $endDateTime = DateTime::createFromFormat($dbFormat, $end);

    // Debugging output
    if (!$startDateTime || !$endDateTime) {
        echo json_encode(['error' => 'Fehler bei der Datums-Konvertierung.', 'start' => $start, 'end' => $end]);
        exit;
    }

    // Durch die Ergebnisse loopen und nach der Zeit filtern
    foreach ($results as $row) {
        // Konvertiere den VARCHAR-Timestamp in ein DateTime-Objekt
        $rowDateTime = DateTime::createFromFormat($dbFormat, $row['timestamp']);

        // Prüfen, ob die Zeit innerhalb des Zeitraums liegt
        if ($rowDateTime >= $startDateTime && $rowDateTime <= $endDateTime) {
            $filteredResults[] = $row; // Füge die Einträge dem gefilterten Array hinzu
        }
    }

    // Gibt die gefilterten Ergebnisse im JSON-Format zurück
    echo json_encode($filteredResults);

} catch (PDOException $e) {
    // Gibt eine Fehlermeldung zurück, wenn etwas schiefgeht
    echo json_encode(['error' => $e->getMessage()]);
}

?>
