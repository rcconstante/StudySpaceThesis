import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Volume2, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  LucideIcon,
} from 'lucide-react-native';

interface MetricCardProps {
  label: string;
  value: string;
  status: 'good' | 'moderate' | 'bad';
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, status, icon }) => {
  const renderIcon = () => {
    const iconColor = getStatusColor();
    const iconSize = 24;
    
    switch (icon) {
      case 'volume-2':
        return <Volume2 size={iconSize} color={iconColor} />;
      case 'thermometer':
        return <Thermometer size={iconSize} color={iconColor} />;
      case 'droplets':
        return <Droplets size={iconSize} color={iconColor} />;
      case 'sun':
        return <Sun size={iconSize} color={iconColor} />;
      case 'wind':
        return <Wind size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'good':
        return '#16a34a';
      case 'moderate':
        return '#f59e0b';
      case 'bad':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      case 'bad':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <View style={[styles.card, { borderColor: getStatusColor() }]}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>{getStatusText()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    width: '48%',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  status: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
});

export default MetricCard;