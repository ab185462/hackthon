import React, { Component } from 'react';
import FileList from './Components/FileList/FileList';
import Navbar from './Components/Navbar/Navbar';
import ContextMenu from './Components/ContextMenu/ContextMenu';
import Dialogs from './Components/Dialogs/Dialogs';

import { MuiThemeProvider as MaterialUI, createMuiTheme, WithStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { connect } from 'react-redux';
import { initApp, MyDispatch, closeContextMenu } from './Actions/Actions';
import DynamicSnackbar from './Components/Notification/DynamicSnackbar';
import HistoryHandler from './Components/HistoryHandler/HistoryHandler';
import InputLabel from '@material-ui/core/InputLabel';
import './App.css';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
    typography: {
        useNextVariants: true,
    }
});

class App extends Component<AppProps> {

    componentDidMount() {
        this.props.init();
    };

    render() {
        return (
            <div className="App">
                <MaterialUI theme={theme}>
                    <div onClick={this.props.handleHideContextMenu} onContextMenu={this.props.handleHideContextMenu}>
                        <Navbar />
                        <InputLabel style = {{fontSize:"x-large"}} className= "tag" id ="demo-mutiple-checkbox-label">Select an Artifact</InputLabel>

                        <FileList />
                        <ContextMenu />
                        <DynamicSnackbar />
                        <Dialogs />
                    </div>
                </MaterialUI>
                <HistoryHandler />
            </div>
        );
    }
}

interface DispatchProps {
    init(): void;
    handleHideContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

interface AppProps extends DispatchProps {}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: MyDispatch): DispatchProps => {
    return {
        init: () => {
            dispatch(initApp());
        },

        handleHideContextMenu: (event) => {
            const element = event.target as HTMLElement;
            if (!(element.tagName === 'INPUT' || /label/i.test(element.className))) {
                event.preventDefault();
            }
            dispatch(closeContextMenu());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
