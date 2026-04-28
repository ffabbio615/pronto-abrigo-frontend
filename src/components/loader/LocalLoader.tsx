import './LocalLoader.scss';
import useStore from '../../store/useStore';

export default function LocalLoader(){

    const {localLoader} = useStore();

    return(
        <>
            {(localLoader) &&
                <div className='local-loader-container'>
                    <div className='local-loader'></div>
                </div>
            }
        </>
    );
}