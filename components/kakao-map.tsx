'use client'
import { useEffect, useState } from "react";
import { Map, MapMarker } from 'react-kakao-maps-sdk';

interface Props {
    address: string;
}


export default function KakaoMap({address}: Props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [coords, setCoords] = useState({ lat: 33.450701, lng: 126.570667 }); // 기본값(제주)
    
    useEffect(()=>{
      // SDK 로드 대기
      const kakao = (window as any).kakao;
      if(!kakao || !kakao.maps) return;
      
      kakao.maps.load(()=>{
        setIsLoaded(true);
        // 주소 -> 좌표 변환 (Geocoder)
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result:any, status:any)=>{
          if(status === kakao.maps.services.Status.OK){
            // result[0].y, result[0].x 가 바로 좌표입니다.
            setCoords({ lat: result[0].y, lng: result[0].x });
          }
        })
      })

    },[address])

    return (
      <Map center={coords} style={{width: '100%', height: '100px'}} level={3}>
        <MapMarker position={coords} />
      </Map>
    )
}