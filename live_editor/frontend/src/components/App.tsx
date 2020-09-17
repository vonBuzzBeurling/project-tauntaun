import React, { useEffect, createContext } from 'react';

import './App.css';

import { CampaignMap, EditWaypointForm } from './';
import { MenuBar } from './';
import { AppStateContainer, Group } from '../models';
import { AddFlightForm } from './AddFlightForm';
import { findGroupById } from '../models/dcs_util';
import { LoadoutEditor } from './LoadoutEditor';
import { BriefingForm } from './BriefingForm';
import { Sessions } from '../models/sessionData';
import { Legend } from './Legend';

type ModeContextType = {
  groupMarkerOnClick?: (group: Group, event: any) => void;
  selectedGroupId?: number;
};

type SessionContextType = {
  sessionId: number;
  sessions: Sessions;
};

type LegendType = {
  color: string;
  text: string;
};

type LegendContextType = {
  legends: LegendType[];
};

type MapContextType = {
  map: any;
};

const colorPalette = ['red', 'black', 'orange', 'blue', 'green', 'brown', 'cyan', 'magenta', 'white'];

export const ModeContext = createContext({} as ModeContextType);
export const SessionContext = createContext({} as SessionContextType);
export const ColorPaletteContext = createContext(colorPalette);
export const LegendContext = createContext({} as LegendContextType);
export const MapContext = createContext({} as MapContextType);

export function App() {
  const appState = AppStateContainer.useContainer();

  useEffect(() => {
    appState.initialize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { location, selectedWaypoint, selectedGroupId, selectedUnitId } = appState;

  const group = selectedGroupId ? findGroupById(appState.mission, selectedGroupId) : undefined;
  const unit = group && selectedUnitId ? group.units.find(u => u.id === selectedUnitId) : undefined;
  const sessionData = appState.sessions[appState.sessionId];
  const terrain = appState.mission.terrain;

  const groupMarkerOnClick = (group: Group, event: any): void => {
    if (!appState.adminMode) return;

    if (event && event.coalition !== 'blue') return;

    console.info(`selecting group`, group);

    if (selectedGroupId === undefined) {
      appState.selectGroup(group.id);
    }
    if (selectedGroupId === group.id) {
      appState.selectGroup(undefined);
    } else {
      appState.selectGroup(group.id);
    }
  };

  const renderEditWaypointForm = () => {
    if (selectedGroupId && selectedWaypoint) {
      if (group) {
        return <EditWaypointForm group={group} pointIndex={selectedWaypoint} />;
      }
    }

    return;
  };

  return (
    <div>
      <img className="Logo" src="./logo.png" alt="Yes I'm serious." />
      <MapContext.Provider value={{ map: undefined } as MapContextType}>
        <LegendContext.Provider value={{ legends: [] }}>
          <ColorPaletteContext.Provider value={colorPalette}>
            <SessionContext.Provider value={{ sessionId: appState.sessionId, sessions: appState.sessions }}>
              {sessionData && <BriefingForm />}
              {location && <AddFlightForm location={location} />}
              {renderEditWaypointForm()}
              {appState.loadoutEditorVisibility && unit && <LoadoutEditor unit={unit} />}
              <MenuBar />
              <ModeContext.Provider
                value={{
                  groupMarkerOnClick: groupMarkerOnClick,
                  selectedGroupId: selectedGroupId
                }}
              >
                <CampaignMap
                  lat={terrain.map_view_default.lat}
                  lng={terrain.map_view_default.lon}
                  zoom={9}
                  tileLayerUrl={`https://api.mapbox.com/styles/v1/${appState.mapType}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2hpbnBvayIsImEiOiJjamxnYmtubDIxNXkxM3FtaWR2dThvZTU3In0.EQeuA12Ganj2LkQ8VRn3lA`}
                  mission={appState.mission}
                />
                {appState.showLegend && <Legend />}
              </ModeContext.Provider>
            </SessionContext.Provider>
          </ColorPaletteContext.Provider>
        </LegendContext.Provider>
      </MapContext.Provider>
    </div>
  );
}
