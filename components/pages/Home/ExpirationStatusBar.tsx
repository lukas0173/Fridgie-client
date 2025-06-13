import React from 'react'
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native'

const TabExpirationOptions = ({activeStatusTab, target, setActiveStatusTab}: {
    activeStatusTab: string,
    target: string,
    setActiveStatusTab: any
}) => <TouchableOpacity
    style={[styles.statusTab, activeStatusTab === target && styles.activeStatusTab]}
    onPress={() => setActiveStatusTab(target)}
>
    <Text
        style={[styles.statusTabText, activeStatusTab === target && styles.activeStatusTabText]}>
        {target}
    </Text>
</TouchableOpacity>

const ExpirationStatusBar = ({activeStatusTab, setActiveStatusTab}: any) => {

    return <View style={styles.statusTabsContainer}>
        <TabExpirationOptions activeStatusTab={activeStatusTab} target={"Critical"}
                              setActiveStatusTab={() => setActiveStatusTab("Critical")}/>
        <TabExpirationOptions activeStatusTab={activeStatusTab} target={"Warning"}
                              setActiveStatusTab={() => setActiveStatusTab("Warning")}/>
        <TabExpirationOptions activeStatusTab={activeStatusTab} target={"Outdated"}
                              setActiveStatusTab={() => setActiveStatusTab("Outdated")}/>
    </View>
}

export default ExpirationStatusBar

const styles = StyleSheet.create({
    statusTabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden',
    },

    statusTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeStatusTab: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        margin: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statusTabText: {
        color: '#666',
        fontWeight: '600',
    },
    activeStatusTabText: {
        color: '#333',
    },
})