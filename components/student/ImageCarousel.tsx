import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setActiveIndex(currentIndex);
  };

  const scrollToImage = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: width * index,
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      scrollToImage(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      scrollToImage(activeIndex + 1);
    }
  };

  // Function to get the correct image source
  const getImageSource = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      // Remote image
      return { uri: imagePath };
    } else {
      // For local images, we need to map the path to the actual image
      // This approach uses hardcoded mapping for the specific images we have
      // A more dynamic approach would require a different pattern
      if (imagePath.includes('Library1.png')) {
        return require('../../public/images/Library1.png');
      } else if (imagePath.includes('Library2.png')) {
        return require('../../public/images/Library2.png');
      } else if (imagePath.includes('Library3.png')) {
        return require('../../public/images/Library3.png');
      } else if (imagePath.includes('Ayunta1.jpg')) {
        return require('../../public/images/Ayunta1.jpg');
      } else if (imagePath.includes('Ayunta2.jpg')) {
        return require('../../public/images/Ayunta2.jpg');
      } else if (imagePath.includes('Ayunta3.jpg')) {
        return require('../../public/images/Ayunta3.jpg');
      } else if (imagePath.includes('KUBO1.jpg')) {
        return require('../../public/images/KUBO1.jpg');
      } else if (imagePath.includes('KUBO2.jpeg')) {
        return require('../../public/images/KUBO2.jpeg');
      } else if (imagePath.includes('KUBO3.jpg')) {
        return require('../../public/images/KUBO3.jpg');
      } else if (imagePath.includes('LABSPACE1.jpg')) {
        return require('../../public/images/LABSPACE1.jpg');
      } else if (imagePath.includes('LABSPACE2.jpg')) {
        return require('../../public/images/LABSPACE2.jpg');
      } else if (imagePath.includes('LABSPACE3.png')) {
        return require('../../public/images/LABSPACE3.png');
      } else if (imagePath.includes('COS1.png')) {
        return require('../../public/images/COS1.png');
      } else if (imagePath.includes('COS2.jpg')) {
        return require('../../public/images/COS2.jpg');
      } else if (imagePath.includes('COS3.jpg')) {
        return require('../../public/images/COS3.jpg');
      } else {
        // Default fallback if no match
        return require('../../assets/images/icon.png');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={getImageSource(image)}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {activeIndex > 0 && (
        <TouchableOpacity
          style={[styles.navButton, styles.leftButton]}
          onPress={handlePrevious}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>
      )}

      {activeIndex < images.length - 1 && (
        <TouchableOpacity
          style={[styles.navButton, styles.rightButton]}
          onPress={handleNext}
          activeOpacity={0.7}
        >
          <ChevronRight size={24} color="white" />
        </TouchableOpacity>
      )}

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationDotActive,
            ]}
            onPress={() => scrollToImage(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 250,
  },
  scrollContent: {
    height: 250,
  },
  image: {
    width,
    height: 250,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 12,
  },
});

export default ImageCarousel;