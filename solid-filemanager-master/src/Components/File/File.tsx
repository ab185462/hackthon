import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    setSelectedItemsFromLastTo, loadAndEditFile, loadAndDisplayFile, displaySelectedMediaFile,
    rightClickOnFile, enterFolderByItem, MyDispatch, openContextMenu, toggleSelectedItem, selectItems
} from '../../Actions/Actions';
import './File.css';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import blue from '@material-ui/core/colors/blue';
import { FileItem, Item } from '../../Api/Item';
import { AppState } from '../../Reducers/reducer';
import { DropDownMenu } from 'material-ui';
//import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
const { forwardRef, useRef, useImperativeHandle } = React;
class File extends Component<FileProps> {
    render() {
        const { isSelected, item, handleClick, handleDoubleClick, handleContextMenu } = this.props;
        const avatarStyle = {
            backgroundColor: isSelected ? blue['A200'] : undefined
        };
        const realSize = (item instanceof FileItem) ? item.getDisplaySize() : null;
        return (
            //<DropDownMenu className="File"  /*onChange={handleClick}*/ onChange={handleDoubleClick} /*onContextMenu={handleContextMenu}*/ data-selected={isSelected}>
           <div>
           <FormControl className="File">
           <MenuItem  value={item.getDisplayName()} onClick={handleDoubleClick}>
            <ListItemText className="filename" primary={item.getDisplayName()} secondary={realSize} />
            </MenuItem>
           </FormControl>
            </div>
        );
    }
}
interface FileOwnProps {
    item: Item;
}
interface StateProps {
    isSelected: boolean;
}
interface DispatchProps {
    handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
    handleDoubleClick(): void;
    handleContextMenu(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}
interface FileProps extends FileOwnProps, StateProps, DispatchProps {}
const mapStateToProps = (state: AppState, ownProps: FileOwnProps): StateProps => {
    return {
        isSelected: state.items.selected.includes(ownProps.item)
    };
};
const x = () =>{
    console.log("fkf");
}
const mapDispatchToProps = (dispatch: MyDispatch, ownProps: FileOwnProps): DispatchProps => {
    return {
        handleDoubleClick: () => {
            const item = ownProps.item;
            if (item instanceof FileItem) {
                if (item.isEditable())
                    dispatch(loadAndEditFile(item.name));
                else if (item.isImage())
                    dispatch(loadAndDisplayFile(item.name));
                else if (item.isMedia())
                    dispatch(displaySelectedMediaFile());
            }
            else
                dispatch(enterFolderByItem(item));
        },
        handleContextMenu: (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent) => {
            event.preventDefault();
            event.stopPropagation();
            let x = 0;
            let y = 0;
            if (event.nativeEvent instanceof MouseEvent) {
                x = event.nativeEvent.clientX;
                y = event.nativeEvent.clientY;
            }
            else if (event.nativeEvent instanceof TouchEvent) {
                x = event.nativeEvent.touches[0].pageX;
                y = event.nativeEvent.touches[0].pageY;
            }
            else {
                console.warn("Unknown click event", event);
            }
            if (event.shiftKey) {
                dispatch(setSelectedItemsFromLastTo(ownProps.item));
            } else {
                dispatch(rightClickOnFile(ownProps.item));
            }
            dispatch(openContextMenu({ x, y }));
        },
        handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent) => {
            event.stopPropagation();
            if (event.ctrlKey) {
                dispatch(toggleSelectedItem(ownProps.item));
            } else if (event.shiftKey) {
                dispatch(setSelectedItemsFromLastTo(ownProps.item));
            } else {
                dispatch(selectItems([ownProps.item]));
            }
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(File);