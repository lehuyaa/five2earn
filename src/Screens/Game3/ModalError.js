import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
const padding = 16;
const width = Dimensions.get('window').width - 2 * padding;
const ModalError = ({modalVisible, setModalVisible}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '100%',
            }}>
            <Image
              style={{
                height: 22,
                width: 22,
              }}
              source={require('../../../images/Game/remove.png')}
            />
          </View>
        </TouchableOpacity>

        <Image
          style={{
            height: 230,
            width: 224,
            marginTop: '20%',
          }}
          source={require('../../../images/Game/error.png')}
        />
        <Text style={styles.modalText}>
          The NFC you scan is not eligible for this mini-game so far
        </Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#000000',
    opacity: 0.85,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#553EF4',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: width,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 33,
  },
});

export default ModalError;
