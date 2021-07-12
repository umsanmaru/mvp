import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

const LoaderV2 = ({text}) => {
    return (
        <Dimmer active inverted>
            <Loader> <h3>{text ? text : "로딩 중"}</h3>  </ Loader>
        </Dimmer>
    )
}

export default LoaderV2