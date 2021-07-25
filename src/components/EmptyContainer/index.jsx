import React, { Component } from 'react';
import style from './index.module.less';
import ContainerResize from 'container-resize';
import IconFont from '../IconFont';

class ContainerBox extends Component {
  node = null;
  nodeBottomLine = null;
  state = {
    dragPosition: '',
    isDisabledRowSelected: false,
    isDisabledColSelected: false,
  };
  setTimeValue = null;
  onDragOver = event => {
    event.preventDefault();
    event.stopPropagation();

    const { model } = this.props;

    if(!(this.dragContainerElement && model.dragComponentName)) {
      return;
    }

    // 判断嵌入的组件是否与父组件一样，那么有父组件就够了，不需要再嵌入一层
    const isRepeat = model.dragComponentName && this.dragContainerElement.parentNode.getAttribute('nodetype') === model.dragComponentName.toLocaleLowerCase();

    if (!isRepeat) {
      this.setState({
        dragPosition: 'in',
      });
    }
    else {
      this.dragContainerElement.setAttribute('dragerror', 'repeat')
    }
  };

  onDragLeave = event => {
    event.preventDefault();
    const { dragPosition } = this.state;

    if (dragPosition) {
      this.setState({
        dragPosition: '',
      });
    }
    this.dragContainerElement.setAttribute('dragerror', '');
  };

  removeContent = () => {
    const { dispatchEditModel, nodeId } = this.props;
    dispatchEditModel('removeComponentConfig', {
      nodeId,
    });
  };

  onDrop = event => {
    const { dispatchEditModel, nodeId } = this.props;
    const { dragPosition } = this.state;
    dispatchEditModel('addComponentConfig', {
      nodeId,
      dragPosition,
    });
    this.setState({
      dragPosition: '',
    });
    this.dragContainerElement.setAttribute('dragerror', '');
  };

  timeValue;
  setComponentStyle = ({
    width,
    height,
    isMaxWidthToParentNode,
    parentUsedWidth
  }) => {
    const { nodeId, dispatchEditModel} = this.props;
    // const componentStyle = {}
    //   if(width && !isMaxWidthToParentNode) {
    //     componentStyle.width = `${width}px`;
    //     componentStyle.flex = '';
    //   }
    //   else if(width && isMaxWidthToParentNode && (parentUsedWidth || parentUsedWidth === 0)) {
    //     componentStyle.width = '';
    //     componentStyle.flex = 'auto';
    //   }
    //   if(height) {
    //     componentStyle.height = `${height}px`;
    //   }
    //   dispatchEditModel('setComponentStyle',{
    //     nodeId: nodeId,
    //     style: componentStyle
    //   });
    if(this.timeValue) {
      clearTimeout(this.timeValue);
      this.timeValue = null;
    }
    this.timeValue = setTimeout(() => {
      const componentStyle = {}
      if(width && !isMaxWidthToParentNode) {
        componentStyle.width = `${width}px`;
        componentStyle.flex = '';
      }
      else if(width && isMaxWidthToParentNode && (parentUsedWidth || parentUsedWidth === 0)) {
        componentStyle.width = '';
        componentStyle.flex = 'auto';
      }
      if(height) {
        componentStyle.height = `${height}px`;
      }
      dispatchEditModel('setComponentStyle',{
        nodeId: nodeId,
        style: componentStyle
      });
      clearTimeout(this.timeValue);
      this.timeValue = null;
    }, 0)
  }

  render() {
    const {
      children,
      model,
      nodeId,
      nodeName,
      isParent,
      dispatchEditModel,
      viewEditorConfig = {},
      levelIndex,
      global,
    } = this.props;
    const { dragPosition, isMouseOver } = this.state;
    const selectedEmptyContainerByNodeId = model.selectedEmptyContainerByNodeId;
    const myStyle = this.props.style;
    const isDragLeft = levelIndex > 0;

    const isDark = global.themeMode === 'dark';

    //当样式flex: 'auto'、'1'时，增加dom属性，通过dom属性修改'.dragContainer'样式(使它不占位)
    const params = {};
    if(myStyle && myStyle.flex) {
      params.styleflex = myStyle.flex;
    }

    let dragDirections = ['right', 'left', 'bottom'];
    let dragClassName = 'parentBoxDrag';
    if(viewEditorConfig.disabledHeightStyle) {
      dragDirections = ['right', 'left'];
      dragClassName = 'parentBoxDragRight';
    }

    // if(viewEditorConfig.disabledHeightStyle && isDragLeft) {
    //   dragDirections = ['right', 'left'];
    //   dragClassName = 'parentBoxDragX';
    // }
    // else if(viewEditorConfig.disabledHeightStyle) {
    //   dragDirections = ['right'];
    //   dragClassName = 'parentBoxDragRight';
    // }
    // else if(!isDragLeft) {
    //   dragDirections = ['right', 'bottom'];
    //   dragClassName = 'parentBoxDragRightBottom';
    // }

    return (
      <>
      {isParent ? <ContainerResize
        name={nodeName}
        nodetype="emptycontainer"
        {...params}
        style={myStyle || {}}
        disabled={selectedEmptyContainerByNodeId === nodeId ? false: true}
        onResize={options => {
          this.setComponentStyle(options);
        }}
        onMouseOver={event => {
          event.preventDefault();
          event.stopPropagation();
          if (!isMouseOver) {
            this.setState({
              isMouseOver: true,
            });
          }
        }}
        onMouseOut={event => {
          event.preventDefault();
          this.setState({
            isMouseOver: false,
          });
        }}
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();

          if(
            !(children && children.length) ||
            children[0].key.indexOf('EmptyContainer_') >= 0 ||
            selectedEmptyContainerByNodeId === nodeId
          ) {
            return;
          }

          dispatchEditModel('changeSelectedEmptyContainer', {
            selectedEmptyContainerByNodeId: nodeId,
          });
        }}
        className={`
          ${style.parentBox}
          ${selectedEmptyContainerByNodeId === nodeId ?`${style.parentBoxSelect} ${isDark ? style.parentBoxSelectDark : 'aaa'}`: ''}
          ${isMouseOver ? `${style.parentBoxHover} ${isDark ? style.parentBoxHoverDark : ''}` : ''}
          ${style[dragClassName]}
        `}
        directions={dragDirections}
        >
          <div className={style.emptyContainerTools} >
            <div className={style.emptyContainerToolsBtns}>
              <span onClick={this.removeContent} style={{fontWeight: 'bold'}}>
                <IconFont type="iconsearchclose" />
              </span>
            </div>
          </div>
          <div className={style.selectBorderLeft}></div>
          <div className={style.selectBorderRight}></div>
          <div className={style.selectBorderTop}></div>
          <div className={style.selectBorderBottom}></div>
          {children}
        </ContainerResize> :
        <>

          {children}

          <div
            ref={node => {
              this.dragContainerElement = node;
            }}
            onDrop={this.onDrop}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            className={`
              ${style.dragContainer}
              ${dragPosition ? style.dragContainerSelect : ''}
            `}

          ></div>
        </>
      }
      </>
    );
  }
}
export default ContainerBox;
