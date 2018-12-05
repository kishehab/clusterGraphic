        
        var svgNS = document.createElementNS("http://www.w3.org/2000/svg", "svg").namespaceURI;
        
        //#e8355c, #f2b318, #92b264, #4480ac
        function classifySingles(singles){
            var classification = {};
            for(var i=0; i<singles.length; i++){
                for(var key in singles[i]){
                  if(classification[singles[i][key]]===undefined){
                        classification[singles[i][key]] = 1
                  } else {
                        classification[singles[i][key]] = classification[singles[i][key]]+1;
                  }
                }
            }
            //console.log(classification);
            return classification;
        }

        function setupClusterCircles(classificationObjects){
            
            var clusterCircles = [];
            var sizes = ['XLarge','large','medium','small'];

            for(var k in classificationObjects){
                clusterCircles.push({
                    'type': k,
                    'count': classificationObjects[k],
                    'size': sizes[Math.floor(Math.random()*sizes.length)]
                });
            }

            return clusterCircles;
        }

        function positioning(postion, x, y, m, r) {
            switch (postion) {
                case 0:
                    return {x: x + m + r, y: y - m - r}
                    break;
                case 1:
                    return {x: x - m - r, y: y - m - r}
                    break;
                case 2:
                    return {x: x - m - r, y: y + m + r}
                    break;
                case 3:
                    return {x: x + m + r, y: y + m + r}
                    break;
                default:
                    return {x: x , y: r}
                    break;
            }
        }

        function createClusterNode(singles, height, width){
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.height = height;
            this.width = width;

            var orginX = this.width/2;
            var orginY = this.height/2;

            var motherCircleRadius = 5;
            var margin = 3;

            var radiusSize = {'XLarge': (height/2)*.45, 'large': (height/2)*.40, 'medium':(height/2)*.35,'small':(height/2)*.30};
            var colorType = {'fieldService': '#f2b318', 'inspection': '#4480ac', 'maintinance': '#92b264','wellServices':'#e8355c'};
            
            var XLarge = (height/2)*.45;
            var large = (height/2)*.40;
            var medium = (height/2)*.35;
            var small = (height/2)*.30;

            var motherCircle  = new Circle(orginX,orginY,motherCircleRadius);
            var circles = [];
            //motherCircle.fill('yellow');

            var clusterCircleProperties = setupClusterCircles(classifySingles(singles));
            for (var i = clusterCircleProperties.length - 1; i >= 0; i--) {
                circles.push( new Circle(   positioning(i,orginX,orginY,margin,radiusSize[clusterCircleProperties[i].size]).x, 
                                            positioning(i,orginX,orginY,margin,radiusSize[clusterCircleProperties[i].size]).y,
                                            radiusSize[clusterCircleProperties[i].size],
                                            colorType[clusterCircleProperties[i].type],
                                            clusterCircleProperties[i].count ));
            }

            //console.log(circles);
            //#e8355c, #f2b318, #92b264, #4480ac
            // var upperRight = new Circle(orginX + margin + XLarge, orginY - margin - XLarge, XLarge,'#f2b318');
            // var upperLeft = new  Circle(orginX - margin - small,orginY - margin - small, small,'#4480ac');
            // var lowerLeft = new  Circle(orginX - margin - medium, orginY + margin + medium, medium,'#92b264');
            // var lowerRight = new Circle(orginX + margin + large, orginY + margin + large, large,'#e8355c');

            svg.appendChild(motherCircle.getCircleNode());

            for (var i = circles.length - 1; i >= 0; i--) {
                 svg.appendChild(circles[i].getCircleNode());
                 svg.appendChild(circles[i].connectToMother(motherCircle));

            }
            return svg;
        }
