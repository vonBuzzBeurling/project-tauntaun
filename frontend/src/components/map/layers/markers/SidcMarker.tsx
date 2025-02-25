import './Markers.css';

import React, { useMemo } from 'react';
import ms from 'milsymbol';
import { Icon, Marker as CoreMarker, LeafletEvent, LatLng } from 'leaflet';
import { Marker, Popup, MarkerProps } from 'react-leaflet';

import { omit } from 'lodash';
import { AppStateContainer } from '../../../../models/appState';

export type SidcMarkerProps = MarkerProps & {
  sidc: string;
  label?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function SidcMarkerNonMemo(props: SidcMarkerProps) {
  const { sidc, label } = props;

  const symbol = new ms.Symbol(sidc, { size: 20 });
  const anchor = symbol.getAnchor();
  const icon = new Icon({
    iconUrl: symbol.toDataURL(),
    iconAnchor: [anchor.x, anchor.y]
  });

  return (
    <Marker {...omit(props, 'onadd', 'icon')} icon={icon}>
      {label && <Popup minWidth={100}>{label}</Popup>}
    </Marker>
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function SidcMarker(props: SidcMarkerProps) {
  const { sidc, label, position } = props;
  const positionLatLng = position as LatLng;

  const { commanderMode } = AppStateContainer.useContainer();

  // prettier-ignore
  const memorizedItem = useMemo(() => <SidcMarkerNonMemo {...props} />, [
    sidc,
    label,
    positionLatLng.lat,
    positionLatLng.lng,
    commanderMode
  ]);

  return memorizedItem;
}
