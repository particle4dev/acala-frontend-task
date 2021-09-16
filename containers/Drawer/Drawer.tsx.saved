import * as React from 'react'
import { withRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo'
import RedeemIcon from '@material-ui/icons/Redeem'
import AssignmentIcon from '@material-ui/icons/Assignment'
import RssFeedIcon from '@material-ui/icons/RssFeed'
import {
    ProductName
} from '../AppBar'
// import {version} from '../../package.json'

const useStyles = makeStyles((theme) => ({
    root__header: {
        width: 280,
        maxWidth: 280,
        position: 'relative',
        padding: `0 ${theme.spacing(2)}px`,
        // padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
        // color: theme.palette.primary.contrastText,
        // backgroundColor: theme.palette.primary.main,
        // paddingTop: '56.25%',
        display: 'block'
    },

    root__content: {
        flexGrow: 1,
        boxSizing: 'border-box',
        margin: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        touchAction: 'pan-y'
    },

    root__guideRenderer: {
        padding: 16,
        bottom: 0,
        boxSizing: 'border-box',
        position: 'absolute',
        lineHeight: '24px',
        width: '100%',

        '& ul': {
            listStyleType: 'none',
            margin: 0,
            padding: 0
        },

        '& li:not(:last-child)': {
            padding: '0 10px 0 0',
        },

        '& li': {
            display: 'inline-block'
        },

        '& a': {
            textDecoration: 'none',
            borderBottom: '1px solid transparent'
        }
    },

    root__divider: {
        boxShadow: 'inset 0px 4px 8px -3px rgba(17, 17, 17, .06)',
        height: 5,
        opacity: 1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
    },

}))

function Drawer({ open, toggleDrawer, router }) {
    const classes = useStyles({})
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    const gotoHome = evt => {
        evt.preventDefault()
        toggleDrawer()
        setTimeout(() => {
            console.log('home')
        }, 300)
    }

    const gotoPricing = evt => {
        evt.preventDefault()
        toggleDrawer()
        setTimeout(() => {
            console.log('pricing')
        }, 300)
    }

    const gotoCaseStudies = evt => {
        evt.preventDefault()
        toggleDrawer()
        setTimeout(() => {
            console.log('case studies')
        }, 300)
    }

    const gotoBlogs = evt => {
        evt.preventDefault()
        toggleDrawer()
        setTimeout(() => {
            console.log('blog')
        }, 300)
    }

    const renderHeader = () => (
        <>
            <Toolbar disableGutters className={classes.root__header}>
                <ProductName />
            </Toolbar>
            <Divider className={classes.root__divider} />
            {/* <header className={classes.root__header}>
            Version: {version}
        </header> */}
        </>
    )

    const renderContent = () => (
        <div className={classes.root__content}>
            <List component="div" subheader={<ListSubheader component="div">SECTIONS</ListSubheader>}>
                <ListItem button selected={router.route === 'home'} onClick={gotoHome}>
                    <ListItemIcon><PersonalVideoIcon /></ListItemIcon>
                    <ListItemText primary='Home' />
                </ListItem>
                <ListItem button selected={router.route === 'pricing'} onClick={gotoPricing}>
                    <ListItemIcon><RedeemIcon /></ListItemIcon>
                    <ListItemText primary='Pricing' />
                </ListItem>
                <ListItem button selected={router.route === 'case-studies'} onClick={gotoCaseStudies}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary='Case Studies' />
                </ListItem>
                <ListItem button selected={router.route === 'blog'} onClick={gotoBlogs}>
                    <ListItemIcon><RssFeedIcon /></ListItemIcon>
                    <ListItemText primary='Blog' />
                </ListItem>
            </List>
            <Divider />
            <List>
                {['Feedback', 'About Us', 'FAQ'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <SwipeableDrawer open={open} onOpen={toggleDrawer} onClose={toggleDrawer} disableBackdropTransition={!iOS} disableDiscovery={iOS}>
            {renderHeader()}
            {renderContent()}
            <Typography variant="body2" gutterBottom className={classes.root__guideRenderer}>
                © {new Date().getFullYear()} {process.env.SITE_NAME}
                <ul>
                    <li>
                        <a href="/privacy">
                        Privacy
                        </a>
                    </li>
                    <li>
                        <a href="/agreement">
                        Terms
                        </a>
                    </li>
                </ul>
            </Typography>
        </SwipeableDrawer>
    )
}

Drawer.defaultProps = {}

Drawer.displayName = 'Drawer'

export default withRouter(Drawer)
