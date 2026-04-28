import './SpinLoader.scss';
import useStore from '../../store/useStore';

export default function SpinLoader(){

    const {loader} = useStore();

    return(
        <>
            {(loader) &&
                <div className='loader'>
                    <div className='spin-loader'></div>
                </div>
            }
        </>
    );
}