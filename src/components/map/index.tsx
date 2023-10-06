import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  HTMLAttributes,
} from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { GoogleMap } from "@react-google-maps/api";
import styles from "./styles.module.scss";

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: 39.8333333,
  lng: -98.585522,
};

const DEFAULT_ZOOM = 4;

type MapProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export const Map = ({ className }: MapProps) => {
  const { isLoaded: mapLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAmBDlZKscQG2s8XHoJ1dEX2Rx4m_2-AxM", // todo: jeez please hide this
  });

  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    }),
    []
  );

  const [kmlFileNames, setKmlFileNames] = useState<string[]>([]);
  const [filesLoaded, setFilesLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/kmlFiles")
        .then((response) => response.json())
        .then((names) => {
          setKmlFileNames(names);
          setFilesLoaded(true);
        });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildUrl = (fileName: string): string => {
    return `https://raw.githubusercontent.com/marker004/bike-trip/master/public/files/${fileName}`;
  };

  const kmlImport = useCallback((map: google.maps.Map, fileNames: string[]) => {
    console.log(fileNames);
    fileNames.forEach((fileName) => {
      const url = buildUrl(fileName);
      const kmlLayerOptions: google.maps.KmlLayerOptions = {
        suppressInfoWindows: false,
        preserveViewport: true,
        map,
        url,
      };
      const kml = new window.google.maps.KmlLayer(kmlLayerOptions);
      kml.addListener("status_changed", () => {
        console.log(kml.getUrl(), kml.getStatus());
      });
    });
  }, []);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      kmlImport(map, kmlFileNames);

      map.setOptions(mapOptions);
    },
    [mapOptions, kmlFileNames, kmlImport]
  );

  const onUnmount = useCallback(function callback(map: google.maps.Map | null) {
    // setMap(null);
  }, []);

  return mapLoaded && filesLoaded ? (
    <GoogleMap
      center={mapOptions.center || undefined}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerClassName={`text-amber-700 ${styles.map} ${className}`}
    />
  ) : (
    <></>
  );
};
