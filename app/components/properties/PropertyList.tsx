'use client';

import { useEffect, useState } from 'react';
import PropertyListItem from "./PropertyListItem";
import apiService from '@/app/services/apiService'

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
}

interface PropertyListProps {
    landlord_id?: string | null;
}

const PropertyList: React.FC<PropertyListProps> = ({
    landlord_id
}) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const getProperties = async () => {
        let url = '/api/properties/';

         if (landlord_id){
            url += `?landlord_id=${landlord_id}`
        }
        const tmpProperties = await apiService.get(url);
        
        setProperties(tmpProperties.data);
    };
    useEffect(() => {
        apiService.get('/api/properties');
        
        getProperties();
    }, [landlord_id]);
    return (
        <>
            {properties.map((property) => {  {/* loops through the properties and returns the objects */}
                return (
                    <PropertyListItem 
                        key={property.id}
                        property={property}
                    />
                )
            })}
        </>
    )
}

export default PropertyList