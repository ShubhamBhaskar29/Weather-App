import React from 'react'
import { MainWrapper } from './styles.module'
import { IoSearchOutline } from "react-icons/io5";
import { WiHumidity, WiSandstorm } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { BsFillSunFill, BsCloudyFill, BsCloudRainFill, BsCloudFog2Fill, BsCloud } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from 'axios';
import { error } from 'console';

interface WeatherDataProps {
    name: string;

    main: {
        temp: number,
        humidity: number,

    },
    sys: {
        country: string;
    },
    weather: {
        main: string;
    }[];
    wind: {
        speed: number;
    }


}

const DisplayWeather = () => {

    const api_key = "0cc86d16bf572f78cdc96c096c7627e5"
    const api_Endpoint = "https://api.openweathermap.org/data/2.5/"
    const options = {
        // method: 'GET',
        // headers: {
        //     'x-rapidapi-key': '517941bf62msh3c2185f46597336p1ed2a7jsn31a5cfca459e',
        //     'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        // }
    };

    const [weatherData, setWeatherData] = React.useState<WeatherDataProps | null>(null);

    const [isLoading, setisLoading] = React.useState(false)

    const [searchCity, setSearchCity] = React.useState("")




    const fetchCurrentWeather = async (lat: number, lon: number) => {
        const url = ` ${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        const response = await fetch(url, options);
        const result = await response.json();
        // console.log(result);
        // const response2 = await axios.get(url);
        // const result = await response.text();
        // console.log(result);
        return result;
        // return response.data;

    };

    const fetchWeatherData = async (city: string) => {
        try {
            const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
            const searchResponse = await axios.get(url);

            const currentWeatherData: WeatherDataProps = searchResponse.data;
            return { currentWeatherData };
        }

        catch (error) {
            console.error("Unable to Fetch Data");
            throw error;
        }
    };

    const handleSearch = async () => {
        if (searchCity.trim() === "") {
            return;
        }

        try {
            const { currentWeatherData } = await fetchWeatherData(searchCity);
            setWeatherData(currentWeatherData)

        }
        catch (error) {
            console.error("No Result Found ")
        }
    };






    const iconChanger = (weather: string) => {
        let iconElement: React.ReactNode;
        let iconColor: string;

        switch (weather) {
            case "Rain":
                iconElement = <BsCloudRainFill />
                iconColor = "#272829";
                break;
            case "Clear":
                iconElement = <BsFillSunFill />
                iconColor = "#FFC436";
                break;
            case "Clouds":
                iconElement = <BsCloudyFill />
                iconColor = "#102C57";
                break;
            case "Mist":
                iconElement = <BsCloudFog2Fill />
                iconColor = "#279EFF";
                break;

            default:
                iconElement = <TiWeatherPartlySunny />
                iconColor = "#7B2869"
        }
        return (
            <span className='icon' style={{ color: iconColor }}>
                {iconElement}
            </span>
        )

    }

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
                ([currentWeather]) => {
                    setWeatherData(currentWeather);
                    setisLoading(true);
                    console.log(currentWeather);
                }
            );
        });

    }, []);

    return (
        <MainWrapper>
            <div className="container">
                <div className="searchArea">
                    <input type='text' placeholder='Name of the city'
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                    />

                    <div className="searchCircle">
                        <IoSearchOutline className='searchIcon' onClick={handleSearch} />
                    </div>
                </div>

                {weatherData && isLoading ? (
                    <>
                        <div className="weatherArea">
                            <h1>{weatherData.name}</h1>
                            <span>{weatherData.sys.country}</span>
                            <div className="icon">
                                {iconChanger(weatherData.weather[0].main)}
                            </div>
                            <h1>{weatherData.main.temp}°C</h1>
                            <h2>{weatherData.weather[0].main}</h2>
                        </div>

                        <div className="bottomInfoArea">
                            <div className="humidityLevel">
                                <WiHumidity className='windIcon' />
                                <div className="humidInfo">
                                    <h2>{weatherData.main.humidity}%</h2>
                                    <p>Humidity</p>
                                </div>
                            </div>

                            <div className="wind">
                                <FaWind className='windIcon' />
                                <div className="humidInfo">
                                    <h2>{weatherData.wind.speed}km/h</h2>
                                    <p>Windspeed</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="loading">
                        <RiLoaderFill className='loadingIcon' />
                        <p>Loading</p>
                    </div>
                )}
            </div>
        </MainWrapper>
    )
}

export default DisplayWeather
