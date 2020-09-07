import { Popup } from 'semantic-ui-react'
import React from 'react'

function myPopup({ content, children }) {
    return (
        <Popup inverted content={content} trigger={children}></Popup>
    )
}

export default myPopup;