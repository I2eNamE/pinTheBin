'use client';

import React, { useState, useEffect } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { BsFillPinMapFill } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';
import { ToggleButtons } from '../../addbin/components/togglebutton';
import { getCurrentLocation } from '../../home/utils/getcurrentlocation';
import { ConfirmDelete } from './components/confirmdelete';
import './components/style.css';
import axios from 'axios';

export default function EditBin({ params }) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [markerName, setMarkerName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationValue, setLocationValue] = useState({ lat: 0, lng: 0 });
  const [binTypes, setBinTypes] = useState([]);
  const [binData, setBinData] = useState(null);
  const [toggleButtonStates, setToggleButtonStates] = useState({});

  let url = 'http://localhost:8080/';

  const handleCancelDelete = () => {
    setIsConfirmDeleteVisible(false);
  };

  const editMarkerOnMap = (locationName, name, location, binTypes) => {
    axios.patch(url + 'bin', {
      location: locationName,
      lat: location.lat,
      lng: location.lng,
      binType: binTypes,
      description: name,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteMarkerOnMap = () => {
    console.log('Deleting marker on the map');
    setIsConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    axios.delete(`${url}bin/${params.id}`)
      .then((response) => {
        console.log(response);
        setIsConfirmDeleteVisible(false);
        window.location.href = '/home';
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getLocation = () => {
    getCurrentLocation(
      (userLocation) => {
        setLocationValue(userLocation);
        console.log('User location:', userLocation);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  const handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
  };

  useEffect(() => {
    // Fetch bin data when component mounts
    console.log('Fetching bin data');
    axios.get(`${url}bin/${params.id}`)
      .then((response) => {
        const binData = response.data.response[0];
        setLocationName(binData.location);
        setBinData(binData);
        setMarkerName(binData.description);
        setLocationValue({ lat: binData.lat, lng: binData.lng });
  
        const activeBinTypes = Object.keys(binData).filter(key => binData[key] === 1);
        setToggleButtonStates(activeBinTypes.reduce((acc, type) => {
          acc[type] = true;
          return acc;
        }, {}));
  
        console.log('Active bin types:', activeBinTypes);
        
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.id]);
  

  const handleButtonStateChange = (newButtonStates) => {
    // setToggleButtonStates(newButtonStates); // Avoid this line
    const activeBinTypes = Object.keys(newButtonStates).filter(
      (binType) => newButtonStates[binType].active
    );
    setBinTypes(activeBinTypes);
  };

  return (
    <div>
      <div className="bg-f4f4f4 p-8 min-h-screen font-NotoSansThai font-medium">
        <div className="flex items-center justify-between mb-3 mr-2">
          <a href="/home">
            <button className="text-xl focus:outline-none hover:scale-110 transition-all">
              <IoMdArrowRoundBack size={40} />
            </button>
          </a>
          <h2 className="text-3xl">แก้ไขถังขยะ</h2>
          <div className="w-8">
            <button
              onClick={deleteMarkerOnMap}
              className="bg-ff5151 rounded-lg border border-ebebeb p-1 shadow-lg hover:scale-105 hover:bg-FF0000 transition"
            >
              <MdDeleteForever size={40} color="#ffffff" />
            </button>
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center items-center">
          <form>
            <div className="mb-4">
              <label htmlFor="location" className="block text-xl text-left mb-1">
                ชื่อสถานที่
              </label>
              <textarea
                type="text"
                id="locationName"
                className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
                placeholder="ใส่ชื่อสถานที่ใกล้เคียง"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-xl text-left mb-1">
                คำอธิบาย
              </label>
              <textarea
                type="text"
                id="description"
                className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
                placeholder="ใส่คำอธิบายเพิ่มเติม เช่นสถานที่ใกล้เคียง"
                required
                value={markerName}
                onChange={(e) => setMarkerName(e.target.value)}
              />
            </div>
            <div className="relative mb-4">
            <label htmlFor="location" className="block text-xl text-left mb-1">
              ตำแหน่ง
            </label>
            <textarea
              type="text"
              id="location"
              className="block p-4 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              placeholder="ที่อยู่ของถังขยะ"
              required
              value={`${locationValue.lat}, ${locationValue.lng}`}
              onChange={(e) => setLocationValue(e.target.value)}
            />
            <button
              onClick={getLocation}
              className="absolute top-0 right-0 mt-2 mr-2 rounded-full hover:scale-110 transition"
            >
              <BsFillPinMapFill size={20} />
            </button>
            </div>
            <div>
              <label htmlFor="file" className="block text-xl text-left mb-1">
                อัปโหลดรูปภาพ
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block p-2 border border-ebebeb rounded-xl focus:outline-none bg-ffffff font-normal w-full"
              />
            </div>
          </form>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-center items-center">
              <ToggleButtons
              onButtonStateChange={handleButtonStateChange}
              initialButtonStates={toggleButtonStates}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              editMarkerOnMap(locationName, markerName, locationValue, binTypes);
              setLocationValue({ lat: 0, lng: 0 });
              setIsButtonClicked(true);
              window.location.href = '/home';
            }}
            className={`flex items-center justify-center p-4 w-60 py-2 px-4 rounded-lg transition-all focus:outline-none ${
              isButtonClicked ? 'bg-39da00 text-ffffff' : 'bg-717171 text-ffffff hover:scale-105'
            }`}
          >
            {isButtonClicked ? (
              <img
                src="https://cdn.discordapp.com/attachments/1154651284788498432/1156160485025120336/405bcae6a8367d49f44c04d4362d7340.png?ex=6513f5dc&is=6512a45c&hm=346a5415f0b333b0aac6f08cad2d79b4a66bf092b428eb9bc47ed9abab789411&"
                alt="แก้ไขถังขยะ"
                className="w-6 h-6"
              />
            ) : (
              'แก้ไขถังขยะ'
            )}
          </button>
        </div>
      </div>
      <div className={`dim ${isConfirmDeleteVisible ? 'open' : ''}`} onClick={handleCancelDelete}></div>
      {isConfirmDeleteVisible && (
        <ConfirmDelete
          onCancelDelete={handleCancelDelete}
          onConfirmDelete={confirmDelete}
          isVisible={isConfirmDeleteVisible}
        />
      )}
    </div>
  );
}