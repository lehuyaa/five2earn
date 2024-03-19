import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const padding = 16;
const width = Dimensions.get('window').width - 2 * padding;
const ConfirmModal = ({modalVisible, setModalVisible, submit}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          Are you sure to submit this answer?
        </Text>
        <View style={{flexDirection: 'row', marginTop: 33}}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonClose,
              {
                backgroundColor: '#553EF4',
                borderColor: 'white',
                borderWidth: 1,
              },
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={[styles.textStyle, {color: 'white'}]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonClose,
              {backgroundColor: '#D3FB51'},
            ]}
            onPress={submit}>
            <Text style={[styles.textStyle, {color: '#553EF4'}]}>
              Yes, I’m sure
            </Text>
          </TouchableOpacity>
        </View>
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
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: '48%',
    margin: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
});

export default ConfirmModal;
