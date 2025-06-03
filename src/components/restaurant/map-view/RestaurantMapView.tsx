import { useCallback, useMemo, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { Restaurant } from "../../../models/Restaurant.model";
import { getGoogleMapsApiKey } from "../../../utils/env";
import styles from "./RestaurantMapView.module.css";

interface RestaurantMapViewProps {
  restaurant: Restaurant;
  height?: string;
  width?: string;
}

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export default function RestaurantMapView({
  restaurant,
  height = "400px",
  width = "100%",
}: RestaurantMapViewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: getGoogleMapsApiKey(),
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showAddressInfo, setShowAddressInfo] = useState(true);

  // Get restaurant coordinates or return null if not available
  const center = useMemo(() => {
    if (
      restaurant.address?.location?.coordinates &&
      restaurant.address.location.coordinates.length === 2
    ) {
      // Coordinates are [longitude, latitude] in the data model
      const [lng, lat] = restaurant.address.location.coordinates;
      return { lat, lng };
    }
    return null;
  }, [restaurant.address?.location?.coordinates]);

  const customContainerStyle = useMemo(
    () => ({
      width,
      height,
    }),
    [width, height]
  );

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // Store the map instance in state
    setMap(map);
  }, []);

  const onCenterChanged = useCallback(() => {
    if (map && center) {
      const mapCenter = map.getCenter();
      if (mapCenter) {
        const tolerance = 0.0001; // Adjust this value as needed
        const latDiff = Math.abs(mapCenter.lat() - center.lat);
        const lngDiff = Math.abs(mapCenter.lng() - center.lng);

        const isCentered = latDiff < tolerance && lngDiff < tolerance;
        setShowAddressInfo(isCentered);
      }
    }
  }, [map, center]);

  const onMarkerClick = useCallback(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  if (loadError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          Error loading Google Maps. Please check your API key and try again.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingMessage}>Loading map...</p>
      </div>
    );
  }

  // Show fallback if no coordinates are available
  if (!center) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          Location information is not available for this restaurant.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={customContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        options={mapOptions}
        onCenterChanged={onCenterChanged}
      >
        <Marker
          position={center}
          onClick={onMarkerClick}
          title={restaurant.name || "Restaurant"}
          icon={{
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="12" fill="#FF6B6B" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="16" cy="16" r="4" fill="#FFFFFF"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16),
          }}
        />
      </GoogleMap>

      {restaurant.address && showAddressInfo && (
        <div className={styles.addressInfo}>
          <h4 className={styles.restaurantName}>{restaurant.name}</h4>
          <p className={styles.address}>
            {restaurant.address.firstLine}
            {restaurant.address.city && `, ${restaurant.address.city}`}
            {restaurant.address.postalCode &&
              ` ${restaurant.address.postalCode}`}
          </p>
        </div>
      )}
    </div>
  );
}
