import React, { useState } from 'react';
import { ImagePickerIOS, ImagePickerAndroid } from 'react-native-image-picker';
import { FormData } from 'react-native';

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePickerIOS.showImagePicker({
      mediaType: 'photo',
    });

    if (result.didCancel) {
      return;
    }

    setImage(result.assets[0]);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch('https://example.com/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (response.ok) {
      // The image was uploaded successfully.
    } else {
      // The image upload failed.
    }
  };

  return (
    <View>
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Upload Image" onPress={uploadImage} />
    </View>
  );
};

export default ImageUpload;