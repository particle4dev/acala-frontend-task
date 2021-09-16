import * as React from "react"
// import ClassNames from "classnames"
import { makeStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import Badge from '@material-ui/core/Badge'
// import Button from '@material-ui/core/Button'
import Drawer from 'components/Drawer'
import AppBar, {
    Logo,
    ProductName,
    ToolbarSection,
    HeaderTabs,
} from 'components/AppBar'
import LogoutMenu from 'components/LogoutMenu'

const debug = require('debug')('www:containers:Navbar')

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            right: -6,
            top: 13,
            border: `1px solid ${theme.palette.background.paper}`,
            // padding: '0 4px',
        },
    }),
)(Badge)

const useStyles = makeStyles((theme: Theme) => ({
    root__onlySmallScreen: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },

    root__onlyBigScreen: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },

    root__toolbarSectionHeaderTab: {
        flex: 1,

        [theme.breakpoints.up('md')]: {
            flex: 3,
        },
    }
}))

type INavbarProps = {
    children?: React.ReactElement,
}

function Navbar({children}: INavbarProps) {
    debug('render')
    const classes = useStyles({})
    const [drawerStatus, setDrawerStatus] = React.useState(false)

    const toggleDrawer = () => {
        setDrawerStatus(!drawerStatus)
    }

    const openLoginDialog = evt => {
        if (evt) evt.preventDefault()
        console.log('open login dialog')
    }

    return (
        <>
            <Drawer open={drawerStatus} toggleDrawer={toggleDrawer} />
            <AppBar>
                <Toolbar>
                    <ToolbarSection
                        className={classes.root__toolbarSectionHeaderTab}
                        start
                    >
                        <div
                            className={classes.root__onlySmallScreen}
                            style={{
                                margin: '8px 0',
                            }}
                        >
                            <IconButton
                                color="inherit"
                                aria-label="Menu"
                                onClick={toggleDrawer}
                            >
                                <MenuIcon />
                            </IconButton>
                        </div>
                        <div className={classes.root__onlyBigScreen}>
                            <Logo />
                        </div>
                        <ProductName gutterLeft />
                        <div className={classes.root__onlyBigScreen}>
                            <HeaderTabs />
                        </div>
                    </ToolbarSection>
                    <ToolbarSection alignItems="center" end>
                        <IconButton
                            aria-label="Shopping Cart Icon"
                            style={{
                                marginRight: 24
                            }}
                        >
                            <StyledBadge badgeContent={7} color="primary">
                                <ShoppingCartIcon />
                            </StyledBadge>
                        </IconButton>
                        {/* <Button onClick={openLoginDialog} color="primary" variant="contained" disableElevation>Sign In</Button> */}
                        <LogoutMenu />
                    </ToolbarSection>
                </Toolbar>
                {children}
            </AppBar>
        </>
    )
}

Navbar.displayName = 'Navbar'

Navbar.defaultProps = {}

export default React.memo(Navbar)
