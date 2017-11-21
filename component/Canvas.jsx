import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Layer, Rect, Stage, Group, Image, Circle } from 'react-konva';
import Konva from 'konva'

export default class Canvas extends Component {
    constructor(props) {
      super(props);
      this.state = {
        color: 'green',
        image: null,
        canvasImages: []
      }
      this.handleClick = this.handleClick.bind(this);
      this.handleDragEnd = this.handleDragEnd.bind(this);
      this.handleDragMove = this.handleDragMove.bind(this);
      this.handleMouseOver = this.handleMouseOver.bind(this);
      this.anchorHandleMouseDownTouchStartStart = this.anchorHandleMouseDownTouchStartStart.bind(this);
      this.anchorHandleDragEnd = this.anchorHandleDragEnd.bind(this);
      this.prepareComponentState = this.prepareComponentState.bind(this);
    }

    componentWillMount() {
      console.log("WILLMOUNT this.props: ", this.props)
      this.prepareComponentState(this.props);
    }
    
    componentWillReceiveProps(nextProps) {
      console.log("RECEIVEPROPS this.props: ", this.props)
      console.log("RECEIVEPROPS nextProps: ", nextProps)
      if (nextProps.images.length && nextProps.images.length !== this.props.images.length) {
        this.prepareComponentState(nextProps);
      }
    }
    
    prepareComponentState(props) {
      //set data on state/template
      // var currentResponses = this.state.candidatesResponses.filter(function (elem) {
      //   return elem.questionId === props.currentQuestion.id;
      // });
      props.images.forEach(imageUrl => {
        const newImage = new window.Image();
        newImage.src = imageUrl
        this.state.canvasImages.push({
                image: newImage,
                xTop: 5,
                yTop: 5,
                xBottom: 80,
                yBottom: 80,
                draggable: true
            }
        )
    })
    }

   
    
  
    handleClick() {
      this.setState({
        color: Konva.Util.getRandomColor()
      });
    }
  
    handleDragEnd(e) {
    }
  
    handleDragMove(e) {
      const { x, y } = (e.target instanceof Konva.Circle) ?
        e.target.attrs : // circle
        e.target.children[1].attrs; // rect
      this.setState({
        xBottom: x,
        yBottom: y
      });
      this.anchor.moveToTop();
    }
  
    handleMouseOver(e) {
      //console.log('mouseover', e);
    }
  
    anchorHandleMouseDownTouchStartStart(e) {
      //console.log('anchorHandleMouseDownTouchStartStart');
      // this.setState({draggable: false});
    }
  
    anchorHandleDragEnd(e) {
      //console.log('anchorHandleDragEnd');
      // this.setState({draggable: true});
    }
  
    render() {
        console.log(this.state.canvasImages)
      return (
        <Stage width={1000} height={500}>
        <Layer>
        <Group
          onClick={this.handleClick}
          onDragEnd={this.handleDragEnd}
          onDragMove={this.handleDragMove}
          onMouseOver={this.handleMouseOver}
          draggable={this.state.draggable}
          fill="white"
        >
          <Circle
            fill="black"
            x={this.state.xBottom}
            y={this.state.yBottom}
            ref={anchor => { this.anchor = anchor; }}
            onMouseDown={this.anchorHandleMouseDownTouchStartStart}
            onTouchStart={this.anchorHandleMouseDownTouchStartStart}
            radius={10}
            zIndex={1}
            draggable
          />
          {this.state.canvasImages && this.state.canvasImages.map(image => {
              return (
              <Image
              image={image.image}
              x={image.xTop}
              y={image.yTop}
              width={Math.abs(image.xTop-image.xBottom)}
              height={Math.abs(image.yTop-image.yBottom)}
              stroke={this.state.color}
              zIndex={0}
              /> )
          })}
        </Group>
        </Layer>
      </Stage>
      );
    }
  }
