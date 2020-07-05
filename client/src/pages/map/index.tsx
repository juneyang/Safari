import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Map, CoverView } from '@tarojs/components'

import './map.scss'

interface IProps {
    [keyname: string]: any
}
interface IState {
    [keyname: string]: any
}

export default class Maps extends Taro.Component<IProps, IState>{
    config: Config = {
        navigationBarTitleText: ''
    }

    private MapContext

    constructor( args ){
        super( args )
        this.state = {
            latitude: 0, 
            longitude: 0,
            controls: {
                id: 1,
                position: {
                  left: 0,
                  top: 300 - 50,
                  width: 50,
                  height: 50
                },
                clickable: true
            },
            marks: [],
            points: [],
            currentRegion: {},
            speed: '--'
        }
    }

    componentWillMount(){
        console.log('will mount')
        this.getGps()
        this.getMaps()
        this.MapContext = Taro.createMapContext('MyMap')
        // if( !hasStarted ){
        //     Taro.onLocationChange( this.locationChangeFn.bind(this) )
        //     Taro.setStorageSync('hasStarted', true)
        // }
        Taro.onLocationChange( this.locationChangeFn.bind(this) )
        // this.initLocationMonit()
    }

    locationChangeFn (res){
        console.log('res::::', res )
        let { latitude, longitude, speed } = res
        let _speed = speed < 0 ? '--' : Math.round( speed * 3.6 )
        if( speed < 0 ){
            return
        }
        this.setState({
            latitude, 
            longitude, 
            speed: _speed
        })
    }

    initLocationMonit(){
        this.setState({
            isSafaring: true
        })
        Taro.startLocationUpdate({
            complete: res => {
                this.locationChangeFn.bind(this, res )
            }
        })
    }

    destoryLocationMonit(){
        Taro.offLocationChange( this.locationChangeFn.bind(this) )
        // Taro.offLocationChange( this.locationChangeFn.bind(this) )
        this.setState({
            isSafaring: false
        })
        Taro.stopLocationUpdate()
    }

    componentDidShow() {
        console.log('did show')
    }

    componentDidHide() {
        console.log('did hide')
        // this.destoryLocationMonit()
    }

    componentWillUnmount() {
        console.log( 'will unmount' )
        this.destoryLocationMonit()
    }

    getMaps(){
        return Taro.cloud
        .callFunction({
            name: "getmap"
        }).then( (mapsdata:any) => {
            if( mapsdata.errMsg == 'cloud.callFunction:ok'){
                let { data } = mapsdata.result
                // this.handleMapData( data )
                this.setState({
                    points: data
                })
            } 
        })
    }

    handleMapData( region ){
        let { points } = this.state
        let { start, end } = region
        // let _data = points.slice(0,10)
        // console.log('/_data:::', _data )
        let marks:any = []
        points.map( (item,index) => {
            let { name, center } = item 
            let [ longitude, latitude ] = center
            let _markItem = {
                id: index,
                latitude,
                longitude,
                title: name,
            }
            if( longitude <= end.longitude && longitude > start.longitude &&
                latitude <= end.latitude && latitude > start.latitude 
            ){
                marks.push( _markItem )
            }
        })

        // console.log('marks:::', marks )

        this.setState({
            marks
        })
    }

    getGps(){
        return new Promise( resolve => {
            Taro.getLocation({
                type: 'gcj02',
                altitude: 'true',
                success: ( res ) => {
                    // console.log( 'success:', res );
                    let { latitude, longitude } = res
                    this.setState({
                        latitude, longitude
                    })
                },
                fail: ( res ) => {
                    console.log( 'fail::', res )
                    resolve( null )
                }
            })
        })
    }

    onRegionChange( data ){
        let { type } = data 
        if( type !== 'end' ){
            return
        }
        this.MapContext.getRegion({
            complete: res => {
                let { northeast: end, southwest: start } = res
                // console.log( start, end )
                this.handleMapData({
                    start,
                    end
                })
            }
        })
    }

    onStartSafaring( isSafaring ) {
        if( !!isSafaring ){
            this.destoryLocationMonit()
        } else {
            this.initLocationMonit()
        }
    }

    render(){
        let { latitude, longitude, polyline, marks,
            speed, isSafaring
        } = this.state
        return(
            <View className='Map'>
                <CoverView className={`Map__Speed ${speed > 80 ? 'Map__OverSpeed': ''}`}>
                    <CoverView className='Map__Speed--Number'>{speed}</CoverView>
                    <CoverView className='Map__Speed--Unit'>Km/h</CoverView>
                </CoverView>
                <Map 
                    id='MyMap'
                    className='Map__Container' 
                    showLocation={true}
                    latitude={latitude}
                    longitude={longitude}
                    onRegionChange={this.onRegionChange.bind(this)}
                    showCompass={true}
                    enableTraffic={true}
                    polyline={polyline}
                    showScale={true}
                    markers={marks}
                />
                {/* <map 
                    id="map" 
                    longitude="113.324520" 
                    latitude="23.099994" 
                    scale="14" 
                    controls="{{controls}}" 
                    bindcontroltap="controltap" 
                    markers="{{markers}}" 
                    bindmarkertap="markertap" 
                    polyline="{{polyline}}" 
                    bindregionchange="regionchange" 
                    show-location 
                    style="width: 100%; height: 300px;"></map> */}
                <CoverView 
                    onClick={this.onStartSafaring.bind(this, isSafaring)} 
                    className='Map__Start'
                >{isSafaring? '停止': '开始漫游'}</CoverView>
            </View>
        )
    }
}