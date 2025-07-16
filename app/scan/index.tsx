import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import * as colors from "@/constants/colors/catppuccin-palette.json"

export default function BarcodeScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState<{ type: string, data: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Optional: You can add logic here if permission status changes
    }, [permission]);

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.permissionContainer}>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
            </View>
    );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        setScannedData({ type, data });
    };

    const handleCloseModal = () => {
        setScanned(false);
        setScannedData(null);
    };

    return (
        <View style={styles.container}>
        <CameraView
            style={StyleSheet.absoluteFillObject}
    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
    barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417", "ean13", "code128"], // Add any other types you need
    }}
    />

    {/* Close button to dismiss the scanner */}
    <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
    <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

    {scanned && scannedData && (
        <Modal
            animationType="fade"
        transparent={true}
        visible={scanned}
        onRequestClose={handleCloseModal}
        >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Barcode Scanned!</Text>
    <Text style={styles.modalText}><Text style={styles.boldText}>Type:</Text> {scannedData.type}</Text>
    <Text style={styles.modalText}><Text style={styles.boldText}>Data:</Text> {scannedData.data}</Text>
    <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={handleCloseModal}
        >
        <Text style={styles.scanAgainText}>Scan Again</Text>
    </TouchableOpacity>
    </View>
    </View>
    </Modal>
    )}
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 30,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    scanAgainButton: {
        backgroundColor: colors.latte.colors.green.hex,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 2
    },
    scanAgainText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }
});
