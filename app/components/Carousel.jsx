import React from 'react';
import {Image} from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';

export default function CarouselImages(props) {
	const {arrayImages, height, width} = props;
	const Images = arrayImages.map((image) => image.url);

	const renderItem = ({item}) => {
		return <Image style={{width, height}} source={{uri: item}} />;
	};

	return (
		<Carousel
			layout={'default'}
			data={Images}
			sliderWidth={width}
			itemWidth={width}
			renderItem={renderItem}
		/>
	);
}
