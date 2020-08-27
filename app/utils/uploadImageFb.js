import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import uuid from 'random-uuid-v4';
import {map} from 'lodash';
export const uploadImageStorage = async (images, resource) => {
	const imageBlob = [];
	console.log(images);
	console.log(resource);
	await Promise.all(
		map(images, async (image) => {
			const response = await fetch(image);
			const blob = await response.blob();
			const ref = firebase.storage().ref(`${resource}`).child(uuid());

			await ref.put(blob).then(async (result) => {
				await firebase
					.storage()
					.ref(`${resource}/${result.metadata.name}`)
					.getDownloadURL()
					.then((photoUrl) => {
						imageBlob.push(photoUrl);
					});
			});
		})
	);

	return imageBlob;
};
