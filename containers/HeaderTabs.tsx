import * as React from 'react'
import isNumber from 'lodash/isNumber'
import { withRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import goTo from './goTo';

const debug = require('debug')('www:components:AppBar:HeaderTabs')

const useStyles = makeStyles((theme) => ({
    root: {
        height: 64,
        minHeight: 64,
        marginLeft: 32
    },

    root__tab: {
        minWidth: 100,
        height: 64,
        flex: '1 1 auto'
    },

    root__indicator: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25
    }
}))

function HeaderTabs({ defaultValue = null, router }) {
    debug(`render`)

    const classes = useStyles({})

    const [value, setValue] = React.useState(defaultValue || router.route)

    const handleChange = (evt, value) => {
        evt.preventDefault()
        if(isNumber(value))
            return
        setValue(value)
        setTimeout(() => {
            goTo(value)
        }, 300)
    }

    return (
        <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            className={classes.root}
            classes={{
                indicator: classes.root__indicator
            }}
        >
            <Tab
                label='Home'
                className={classes.root__tab}
                value={'/'}
            />
            <Tab
                label='Scanner'
                className={classes.root__tab}
                value={'/scanner'}
            />
        </Tabs>
    )
}

export default withRouter(HeaderTabs)
