// $('a').not('[href *= "my-domain.com"]').attr('target', '_blank');
















// document.getElementById('awesomeBtn').onClick = function(){
//     console.log('I clicked a button!');
//   }

 
// $('#awesomeBtn').on('click',function(){
//     console.log('I clicked a button!')
// })


//original size of embedded youtube video: 315/560
//we will divide height of 315 by width of 560 to get .5625. Converted to a percentage, we get 56.25% as the percentage of height compared to width
<div class="responsive-iframe">
    <div style="padding-bottom: 56.25%;"></div>
    <iframe src="https://www.youtube.com/embed/r0xcHotlTxA" allowfullscreen></iframe>

</div>

//css for responsive iframe:
.responsive-iframe {
    width: 100%;
    position: relative
}

.responsive-iframe iframe{
    border:none;
    width: 100%;
    height: 100%;
    position: absolute; left: 0; top: 0;
}
