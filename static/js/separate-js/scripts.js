'use strict';

$(function() {

    /*
    |--------------------------------------------------------------------------
    | Change Active State of Links in Sticky Navigation on Scroll
    |--------------------------------------------------------------------------
    */

    var sections = $('.section')
        , nav = $('.fixed-nav')
        , nav_height = $('.header').outerHeight();

    $(window).on('scroll', function () {
        var cur_pos = $(this).scrollTop();

        sections.each(function() {
            var top = $(this).offset().top - nav_height,
                bottom = top + $(this).outerHeight();

            if (cur_pos >= top && cur_pos <= bottom) {
                nav.find('a').removeClass('-active');
                sections.removeClass('-active');

                $(this).addClass('-active');
                nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('-active');
            }
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Smooth Scrolling
    |--------------------------------------------------------------------------
    */

    // Select all links with hashes
    $('a.page-scroll').on('click', function(event) {
        // On-page links
        if ( location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname ) {
            // Figure out element to scroll to
            var target = $(this.hash),
                speed= $(this).data("speed") || 800;
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 60
                }, speed);
            }
        }
    });

    /*
    |--------------------------------------------------------------------------
    | News Timeline
    |--------------------------------------------------------------------------
    */

    //swiper 4.4.1
    var timelineSwiper = new Swiper('.news-timeline .swiper-container', {
        direction: 'vertical',
        loop: false,
        speed: 1600,
        mousewheel: true,
        pagination: {
            el: '.swiper-pagination',
            renderBullet: function (index, className) {
                var year = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-year');
                return '<div class="' + className + '">' + year + '<span>' + '</span>' + '</div>';
            },
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                direction: 'horizontal',
            }
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    $('.jsSearchBtn').click(function() {
        $('.search').addClass('-focused');
    });

    var search = document.querySelectorAll('.search');
    var flagHidden = true;

    search.forEach(function(s,i){
        var jsSearchBtn = search[i].querySelector('.jsSearchBtn');
        var searchInput = search[i].querySelector('.search__input');

        ("click touchstart".split(" ")).forEach(function(e){
            document.addEventListener(e,function(){
                if(flagHidden)search[i].classList.remove('-focused');
                flagHidden = true;
            });
        });
        ("click touchstart".split(" ")).forEach(function(e){
            jsSearchBtn.addEventListener(e,function(){
                search[i].classList.add('-focused');
                searchInput.focus();
                flagHidden = false;
            });
        });
        ("click touchstart".split(" ")).forEach(function(e){
            searchInput.addEventListener(e,function(){
                flagHidden = false;
            });
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Header
    |--------------------------------------------------------------------------
    */

    let header = $('.header.-transparent');

    function stickyHeader() {
        if($(this).scrollTop() > 88) { /*height in pixels when the navbar becomes non opaque*/
            header.removeClass('-transparent');
        } else {
            header.addClass('-transparent');
        }
    }
    $(window).scroll(stickyHeader);
    stickyHeader();

    /*
    |--------------------------------------------------------------------------
    | Mobile menu
    |--------------------------------------------------------------------------
    */

    $('.burger').click(function() {
        $(this).toggleClass('-open');
        $('.m-menu').toggleClass('-show');
        $('.header').removeClass('-transparent');
        if(!$('.m-menu').hasClass('-show') && $(window).scrollTop() < 88) {
            $('.header').addClass('-transparent');
        }
        if ($(this).hasClass('-open')) {
            $('body').css({"overflow": "hidden"});
        } else {
            $('body').css({"overflow": ""});
        }
    });


    /*
    |--------------------------------------------------------------------------
    | Blog Grid
    |--------------------------------------------------------------------------
    */

    let $grid = $('.blog-grid').masonry({
        itemSelector: '.blog-grid__item',
        columnWidth: '.blog-grid__sizer',
        percentPosition: true,
        transitionDuration: 0,
    });

    $grid.imagesLoaded().progress( function() {
        $grid.masonry();
    });

    /*
    |--------------------------------------------------------------------------
    | Sticky Kit
    |--------------------------------------------------------------------------
    */

    if(window.matchMedia('(min-width: 992px)').matches) {
        $(".jsStickyMenu").stick_in_parent({
            offset_top: 130,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Canvas Birds
    |--------------------------------------------------------------------------
    */

    var Bird = function () {

        var scope = this;

        THREE.Geometry.call( this );

        v(   5,   0,   0 );
        v( - 5, - 2,   1 );
        v( - 5,   0,   0 );
        v( - 5, - 2, - 1 );

        v(   0,   2, - 6 );
        v(   0,   2,   6 );
        v(   2,   0,   0 );
        v( - 3,   0,   0 );

        f3( 0, 2, 1 );

        f3( 4, 7, 6 );
        f3( 5, 6, 7 );

        this.computeFaceNormals();

        function v( x, y, z ) {

            scope.vertices.push( new THREE.Vector3( x, y, z ) );

        }

        function f3( a, b, c ) {

            scope.faces.push( new THREE.Face3( a, b, c ) );

        }

    }

    Bird.prototype = Object.create( THREE.Geometry.prototype );
    Bird.prototype.constructor = Bird;

    // Based on https://www.openprocessing.org/sketch/6910

    var Boid = function () {

        var vector = new THREE.Vector3(),
            _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 680,
            _maxSpeed = 2, _maxSteerForce = 0.1, _avoidWalls = false;

        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        _acceleration = new THREE.Vector3();

        this.setGoal = function ( target ) {

            _goal = target;

        };

        this.setAvoidWalls = function ( value ) {

            _avoidWalls = value;

        };

        this.setWorldSize = function ( width, height, depth ) {

            _width = width;
            _height = height;
            _depth = depth;

        };

        this.run = function ( boids ) {

            if ( _avoidWalls ) {

                vector.set( - _width, this.position.y, this.position.z );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

                vector.set( _width, this.position.y, this.position.z );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

                vector.set( this.position.x, - _height, this.position.z );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

                vector.set( this.position.x, _height, this.position.z );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

                vector.set( this.position.x, this.position.y, - _depth );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

                vector.set( this.position.x, this.position.y, _depth );
                vector = this.avoid( vector );
                vector.multiplyScalar( 5 );
                _acceleration.add( vector );

            }/* else {

						this.checkBounds();

					}
					*/

            if ( Math.random() > 0.5 ) {

                this.flock( boids );

            }

            this.move();

        };

        this.flock = function ( boids ) {

            if ( _goal ) {

                _acceleration.add( this.reach( _goal, 0.005 ) );

            }

            _acceleration.add( this.alignment( boids ) );
            _acceleration.add( this.cohesion( boids ) );
            _acceleration.add( this.separation( boids ) );

        };

        this.move = function () {

            this.velocity.add( _acceleration );

            var l = this.velocity.length();

            if ( l > _maxSpeed ) {

                this.velocity.divideScalar( l / _maxSpeed );

            }

            this.position.add( this.velocity );
            _acceleration.set( 0, 0, 0 );

        };

        this.checkBounds = function () {

            if ( this.position.x >   _width ) this.position.x = - _width;
            if ( this.position.x < - _width ) this.position.x =   _width;
            if ( this.position.y >   _height ) this.position.y = - _height;
            if ( this.position.y < - _height ) this.position.y =  _height;
            if ( this.position.z >  _depth ) this.position.z = - _depth;
            if ( this.position.z < - _depth ) this.position.z =  _depth;

        };

        //

        this.avoid = function ( target ) {

            var steer = new THREE.Vector3();

            steer.copy( this.position );
            steer.sub( target );

            steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );

            return steer;

        };

        this.repulse = function ( target ) {

            var distance = this.position.distanceTo( target );

            if ( distance < 150 ) {

                var steer = new THREE.Vector3();

                steer.subVectors( this.position, target );
                steer.multiplyScalar( 0.5 / distance );

                _acceleration.add( steer );

            }

        };

        this.reach = function ( target, amount ) {

            var steer = new THREE.Vector3();

            steer.subVectors( target, this.position );
            steer.multiplyScalar( amount );

            return steer;

        };

        this.alignment = function ( boids ) {

            var count = 0;
            var velSum = new THREE.Vector3();

            for ( var i = 0, il = boids.length; i < il; i++ ) {

                if ( Math.random() > 0.6 ) continue;

                var boid = boids[ i ];
                var distance = boid.position.distanceTo( this.position );

                if ( distance > 0 && distance <= _neighborhoodRadius ) {

                    velSum.add( boid.velocity );
                    count++;

                }

            }

            if ( count > 0 ) {

                velSum.divideScalar( count );

                var l = velSum.length();

                if ( l > _maxSteerForce ) {

                    velSum.divideScalar( l / _maxSteerForce );

                }

            }

            return velSum;

        };

        this.cohesion = function ( boids ) {

            var count = 0;
            var posSum = new THREE.Vector3();
            var steer = new THREE.Vector3();

            for ( var i = 0, il = boids.length; i < il; i ++ ) {

                if ( Math.random() > 0.6 ) continue;

                var boid = boids[ i ];
                var distance = boid.position.distanceTo( this.position );

                if ( distance > 0 && distance <= _neighborhoodRadius ) {

                    posSum.add( boid.position );
                    count++;

                }

            }

            if ( count > 0 ) {

                posSum.divideScalar( count );

            }

            steer.subVectors( posSum, this.position );

            var l = steer.length();

            if ( l > _maxSteerForce ) {

                steer.divideScalar( l / _maxSteerForce );

            }

            return steer;

        };

        this.separation = function ( boids ) {

            var posSum = new THREE.Vector3();
            var repulse = new THREE.Vector3();

            for ( var i = 0, il = boids.length; i < il; i ++ ) {

                if ( Math.random() > 0.6 ) continue;

                var boid = boids[ i ];
                var distance = boid.position.distanceTo( this.position );

                if ( distance > 0 && distance <= _neighborhoodRadius ) {

                    repulse.subVectors( this.position, boid.position );
                    repulse.normalize();
                    repulse.divideScalar( distance );
                    posSum.add( repulse );

                }

            }

            return posSum;

        };

    }

    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
        SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

    var camera, scene, renderer,
        birds, bird;

    var scene3d = document.getElementById("jsCanvasBirds");

    var boid, boids;

    var stats;

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera( 95, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.z = 450;

        scene = new THREE.Scene();


        birds = [];
        boids = [];

        for ( var i = 0; i < 200; i ++ ) {

            boid = boids[ i ] = new Boid();
            boid.position.x = Math.random() * 400 - 200;
            boid.position.y = Math.random() * 400 - 200;
            boid.position.z = Math.random() * 400 - 200;
            boid.velocity.x = Math.random() * 2 - 1;
            boid.velocity.y = Math.random() * 2 - 1;
            boid.velocity.z = Math.random() * 2 - 1;
            boid.setAvoidWalls( true );
            boid.setWorldSize( 500, 500, 400 );

            bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff, side: THREE.DoubleSide } ) );
            bird.phase = Math.floor( Math.random() * 62.83 );
            scene.add( bird );


        }

        renderer = new THREE.CanvasRenderer({alpha: true});
        renderer.setClearColor( 0x000000, 0 ); // the default
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

        //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        //document.body.appendChild( renderer.domElement );

        scene3d.appendChild(renderer.domElement);

        stats = new Stats();
        document.getElementById( 'jsCanvasStats' ).appendChild(stats.dom);

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

        var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

        for ( var i = 0, il = boids.length; i < il; i++ ) {

            boid = boids[ i ];

            vector.z = boid.position.z;

            boid.repulse( vector );

        }

    }

    //

    function animate() {

        requestAnimationFrame( animate );

        stats.begin();
        render();
        stats.end();

    }

    function render() {

        for ( var i = 0, il = birds.length; i < il; i++ ) {

            boid = boids[ i ];
            boid.run( boids );

            bird = birds[ i ];
            bird.position.copy( boids[ i ].position );

            var color = bird.material.color;
            color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

            bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
            bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

            bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
            bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

        }

        renderer.render( scene, camera );

    }


});
