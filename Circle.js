        function Circle(cx, cy, cr, color, label) {
            this.cx = cx;
            this.cy = cy;
            this.cr = cr;
            this.color = color;
            this.label = label;
            this.labelSize = 10;
            this.circle = document.createElementNS(svgNS, 'circle');
            this.g = document.createElementNS(svgNS, "g");
            this.label = document.createElementNS(svgNS, 'text');
            
            this.getConnectionNodes = function() {
                return   [{
                    name: 'urNode',
                    x: this.cr * Math.cos(Math.PI / 4) + this.cx,
                    y: this.cr * Math.sin(Math.PI / 4) + this.cy
                }, {
                    name: 'ulNode',
                    x: this.cr * Math.cos(Math.PI * (3 / 4)) + this.cx,
                    y: this.cr * Math.sin(Math.PI * (3 / 4)) + this.cy
                }, {
                    name: 'llNode',
                    x: this.cr * Math.cos(Math.PI * (5 / 4)) + this.cx,
                    y: this.cr * Math.sin(Math.PI * (5 / 4)) + this.cy
                }, {
                    name: 'lrNode',
                    x: this.cr * Math.cos(Math.PI * (7 / 4)) + this.cx,
                    y: this.cr * Math.sin(Math.PI * (7 / 4)) + this.cy
                }];
            };

            this.constractCircle = function() {
                this.circle.setAttribute('cx', cx);
                this.circle.setAttribute('cy', cy);
                this.circle.setAttribute('r', cr);
                this.circle.setAttribute("stroke", this.color);
                this.circle.setAttribute("stroke-width", 2);
                this.circle.setAttribute('fill', this.color);
                this.circle.setAttribute('fill-opacity', 0.4);

                this.label.setAttribute('x', cx);
                this.label.setAttribute('y', cy);
                this.label.setAttribute('fill', '#000');
                this.label.setAttribute('dy', '.4em');
                this.label.setAttribute('font-family', 'Arial');
                this.label.setAttribute('font-size', this.labelSize);
                this.label.textContent = label;
                this.label.setAttribute('text-anchor','middle');
                
                this.circle.addEventListener('mouseover', function(e) {
                    e.currentTarget.setAttribute('stroke-width', 3);
                });
                this.circle.addEventListener('mouseleave', function(e) {
                    e.currentTarget.setAttribute('stroke-width', 2);
                });
                this.path = convertToPath(this.circle);
                this.g.appendChild(this.circle);
                this.g.appendChild(this.label);
            };
            
            this.getPath = function() {
                return this.path.getAttribute('d');
            };
            this.getX = function() {
                return this.cx;
            };
            this.getY = function() {
                return this.cy;
            };
            this.getR = function() {
                return this.cr;
            };
            
            this.getCircleNode = function() {
                this.constractCircle();
                return this.g;
            };
            this.fill = function(color) {
                this.circle.setAttribute('fill', color);
            };

            this.setTextSize = function(textSize){
                this.labelSize = textSize;
            };

            this.connectToMother = function(mother) {
                var connection = document.createElementNS(svgNS, 'line');
                var connectionNodes = this.getConnectionNodes();
                var motherConnectionNodes = mother.getConnectionNodes();
                var a, b, distance, shortestDistance = 1000;
                for (var i = motherConnectionNodes.length - 1; i >= 0; i--) {
                    for (var j = connectionNodes.length - 1; j >= 0; j--) {
                        a = motherConnectionNodes[i].x - connectionNodes[j].x;
                        b = motherConnectionNodes[i].y - connectionNodes[j].y;
                        distance = Math.sqrt(a * a + b * b);
                        if (distance <= shortestDistance) {
                            shortestDistance = distance;
                            connection.setAttribute('x1', motherConnectionNodes[i].x);
                            connection.setAttribute('y1', motherConnectionNodes[i].y);
                            connection.setAttribute('x2', connectionNodes[j].x);
                            connection.setAttribute('y2', connectionNodes[j].y);
                        }
                    }
                }
                connection.setAttribute("stroke", "gray");
                connection.setAttribute("stroke-width", 1);
                return connection;
            };
        }
