import { InfinitySpin } from "react-loader-spinner";
import React from 'react'

const LoadingScreen = () => {
    return (
                <div className="loader">
                    <InfinitySpin
                        visible={true}
                        width="200"
                        ariaLabel="infinity-spin-loading"
                        color="rgba(76, 955, 1)"
                    />
                </div>
    )
}

export default LoadingScreen