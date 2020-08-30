import * as firebase from 'firebase/app';
import 'firebase/storage';
import uuid from 'random-uuid-v4';
/* import imageCompression from 'browser-image-compression'; */

const saveImage = (image) => {
	return new Promise(async (resolve, reject) => {
		const {path, name, blob} = image;
		const storageRef = firebase.storage().ref();
		const uploadTask = storageRef.child(`${path}/${name}`).put(blob);
		uploadTask.on(
			firebase.storage.TaskEvent.STATE_CHANGED,
			(snapshot) => {},
			(error) => {
				reject(error);
			},
			() => {
				uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
					resolve(downloadURL);
				});
			}
		);
	});
};

const resize = async (path, image) => {
	console.log('resize');
	console.log('image', image);
	/* const {url, rawFile} = image; */
	const extension = image.split('.')[1];

	console.log('extension', extension);
	const url = image.split('.')[0];
	const name = `${uuid()}.${extension}`;
	console.log('name', name);
	const options = {
		maxWidthOrHeight: path === 'users' ? 80 : 300,
		useWebWorker: true
	};
	console.log('options', options);
	try {
		const response = await fetch(image);
		console.log('response', response);

		const blobCreated = await response.blob();

		/* 	const blobCreated = await fetch(url).then((r) => r.blob()); */
		console.log('blobCreated', blobCreated);
		/* const blob = await imageCompression(blobCreated, options); */
		/* console.log('blob', blob); */
		return {path, blobCreated, name};
	} catch (e) {
		console.error(e);
	}
};

export const UploadImageFireBase = async (path, images) => {
	console.log('entro');
	const processedImages = await Promise.all(
		images.map((image) => resize(path, image))
	);
	return Promise.all(processedImages.map((image) => saveImage(image)));
};
/* 
const uploadImageStorage = async () => {
	const imageBlob = [];

	await Promise.all(
		map(imagesSelected, async (image) => {
			const response = await fetch(image);
			const blob = await response.blob();
			const ref = firebase.storage().ref('restaurants').child(uuid());
			await ref.put(blob).then(async (result) => {
				await firebase
					.storage()
					.ref(`restaurants/${result.metadata.name}`)
					.getDownloadURL()
					.then((photoUrl) => {
						imageBlob.push(photoUrl);
					});
			});
		})
	);

	return imageBlob;
}; */
