import React,{useState,useEffect,useRef} from 'react'
import './MusicPlayerCard.scss'
import audios from "../Song/Song";
import {AiFillPauseCircle, AiFillPlayCircle, BiSkipNext, BiSkipPrevious, FaRandom, FiRepeat} from "react-icons/all";
const MusicPlayerCard =()=>{
    const [song]=useState(audios)
    const [index,setIndex]=useState([]);
    function calTimer(time){
        let min=Math.floor(time/60)
        let sec=Math.round(time%60)
        if(sec<10) sec='0'+sec
        return `${min}:${sec}`

    }
    const[currentTime, setCurrentTime]=useState(0);
    const intervalRef=useRef()
    const [changeTime,setChangeTime]=useState('0:00');
    const [lengthTime,setLenghTime]=useState([calTimer(0),0]);
    const [isPlay,setIsPlay]=useState(false)
    const[isRepeat,setIsRepeat]=useState(false)
    const[isRandom,setIsRandom]=useState(false)
    const[width,setWidth]=useState(0)
    let style={
        width: `${width}%`
    }
    let clickedStyle={color:'#ef1e21'}
    let notClickedStyle={color:'#cccccc'}
    const [audio,setAudio]=useState()
    const [songID,setSongID]=useState()
    function clickCard(numb) {
        setCurrentTime(0)
        setSongID(document.getElementById(`song_${index}`))
        if (index!==numb){
            setIndex(numb);
            setAudio(new Audio(song[numb].src))
            if (audio!=undefined) {
                stop()
            }
        }
        else {
            if (audio!=undefined){
                audio.load()
                audio.play()
            }
        }
    }     // change song
    function play(){
        setCurrentTime( audio.currentTime)
        intervalRef.current = setInterval(creaseNum, 1000);
        const isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended  && audio.readyState > audio.HAVE_CURRENT_DATA;
        if(!isPlaying) audio.play()
    }
    function stop() {
        audio.currentTime=0
        audio.pause()
    }
    function pause(){
        clearInterval(intervalRef.current)
        audio.pause()
    }
    function skipnext(){
        if(isPlay){
            if(!isRandom){
                if (index<11)clickCard(index+1)
            }
            else clickCard(Math.floor(Math.random()*11))
        }
    }
    function skipprev(){
        if(isPlay){
            if(!isRandom){
                if (index>0 ) clickCard(index-1)
            }
            else clickCard(Math.floor(Math.random()*11))
        }
    }
    function playclick(){
        if(index.length!=0){setIsPlay(!isPlay);play()}
        else {
            clickCard(Math.floor(Math.random()*11))
        }
    }
    function pauseclick(){
        if (index.length!=0){setIsPlay(!isPlay);pause();}
    }
    const creaseNum=()=>setCurrentTime(currentTime=>currentTime+1)
    useEffect(()=>{
        intervalRef.current=setInterval(creaseNum,1000)
        return () => clearInterval(intervalRef.current);
    },[])
    function slide(e){
        if(isPlay){
            if(audio!=undefined){
                audio.pause()
                clearInterval(intervalRef.current)
                setCurrentTime(e.target.value)
                audio.currentTime=e.target.value
                play()
            }
        }
    }
    useEffect(
        ()=>{
            if(isPlay==true){
                setWidth(currentTime/lengthTime[1]*100)
                if (currentTime>lengthTime[1]){
                    if(!isRandom && !isRepeat) if(index<12) clickCard(index+1)
                    if(isRandom) clickCard(Math.floor(Math.random()*11))
                    if(isRepeat) clickCard(index)

                }
                else {

                    }
            }
        },[currentTime]
    )
    useEffect(
        ()=>{
            if (audio!=undefined){
                audio.load()
                audio.play();
                setIsPlay(true);
                }
        }
    ,[index])
    useEffect(
        ()=>{if (audio!=undefined) {
            if(songID!=null || songID!=undefined){
                document.getElementById(`song_${index}`).scrollIntoView({behavior:'smooth',block:'center'})
            }
            audio.onloadedmetadata= function () {
                setCurrentTime(0)
                setLenghTime([calTimer(audio.duration),audio.duration])}
        }}
    ,[audio])
    useEffect(
        ()=>{
            if(isRandom==true) setIsRepeat(false)
        },[isRandom]
    )
    useEffect(
        ()=>{
            if(isRepeat==true) setIsRandom(false)
        },[isRepeat]
    )

    return(
        <div>
            <div className="card">
                <div className="songs-wrapper">
                    <div className="row">
                        {song.map((item,numb)=>
                            <div className="col s12 m6 l4 x3">
                                <div className={`${index}`==`${numb}`?`playing-song song `:`song`}>
                                    <div className="song-image" style={{backgroundImage:`url(${item.img})`}}></div>
                                    <div className="song-info">
                                        <div id={`song_${numb}`} onClick={()=>{clickCard(numb)}} className="song-title">{item.title}</div>
                                        <div onClick={()=>{clickCard(numb)}} className="song-artist">{item.author}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='music-controller'>
                <div className='red-line' style={style}></div>
                <div className='ranger-slider'>
                    <input
                            onMouseUp={(e)=>{slide(e)}}
                            onBlur={(e)=>{e.target.defaultValue=currentTime}}
                          type="range" min='0' max={lengthTime[1]}  className="slider" id="myRange"/>
                </div>
                <div className='timer flex justify-center'>
                    <div className='timer-current'>{`${index}`?`${calTimer(currentTime)}`:`0:00`}</div>
                    <div className='current-song '>{`${index}`?`${song[index].title}`:``}</div>
                    <div className="timer-length">{`${index}`?`${lengthTime[0]}`:`0:00`}</div>
                </div>
                <div className='play-controller flex justify-center'>
                    <BiSkipPrevious onClick={()=>skipprev()}  className='skip-btn prev-btn bottom-2 text-5xl flex-initial' />
                    {isPlay==false
                        ? <AiFillPlayCircle onClick={()=>playclick()} className='  play-btn    text-5xl flex-initial'/>
                        : <AiFillPauseCircle onClick={()=>pauseclick()} className='  play-btn    text-5xl flex-initial'/>}
                    <BiSkipNext onClick={()=>skipnext()} className='skip-btn next-btn text-5xl flex-initial' />
                </div>
                <div className='other-btn my-auto text-xl flex justify-center'>
                    <FaRandom onClick={()=>setIsRandom(!isRandom)} className='random-btn  m-2 ' style={isRandom  ?  clickedStyle : notClickedStyle}/>
                    <FiRepeat onClick={()=>setIsRepeat(!isRepeat)} className='repeat-btn  m-2  ' style={isRepeat ? clickedStyle : notClickedStyle}/>
                </div>
            </div>
        </div>
    )
}
export default MusicPlayerCard