let nodeLink = function(){
    let self = {
        nodes : [{ id: 'mammal' },
                { id: 'dog' },
                { id: 'cat' },
                { id: 'fox' },
                { id: 'elk' },
                { id: 'insect' },
                { id: 'ant' },
                { id: 'bee' },
                { id: 'fish' },
                { id: 'carp' },
                { id: 'pike' }],
        links : [{ target: 'mammal', source: 'dog', strength: 0.5 },
                { target: 'mammal', source: 'cat', strength: 0.5 },
                { target: 'mammal', source: 'fox', strength: 0.5 },
                { target: 'mammal', source: 'elk', strength: 0.5 },
                { target: 'insect', source: 'ant', strength: 0.5 },
                { target: 'insect', source: 'bee', strength: 0.5 },
                { target: 'fish', source: 'carp', strength: 0.5 },
                { target: 'fish', source: 'pike', strength: 0.5 },
                { target: 'cat', source: 'elk', strength: 0.1 },
                { target: 'carp', source: 'ant', strength: 0.1 },
                { target: 'elk', source: 'bee', strength: 0.1 },
                { target: 'dog', source: 'cat', strength: 0.1 },
                { target: 'fox', source: 'ant', strength: 0.1 },
                { target: 'pike', source: 'cat', strength: 0.1 }]   

    }

    let createView = function(){
        let graph = d3.select('#graph').append('svg')
            .attr('width', window.innerWidth * 0.3)
            .attr('height', window.innerHeight * 0.44);
        
        let forceLink = d3.forceLink()
            .id(link => { return link.id; })
            .strength(link => { return link.strength; });

        let forceSimulation = d3.forceSimulation()
            .force('link', forceLink)
            .force('charge', d3.forceManyBody().strength(-120))
            .force('center', d3.forceCenter(window.innerWidth * 0.15, window.innerHeight * 0.22));
        let drag = d3.drag()
            .on('start', dragstart)
            .on('drag', node => {
                forceSimulation.alphaTarget(0.7).restart();
                node.fx = d3.event.x;
                node.fy = d3.event.y;
            });

        forceSimulation.nodes(self.nodes).on('tick', () => {
            nodeElements
                .attr('cx', node => { return node.x; })
                .attr('cy', node => { return node.y; });
            linkElements
                .attr('x1', link => { return link.source.x; })
                .attr('y1', link => { return link.source.y; })
                .attr('x2', link => { return link.target.x; })
                .attr('y2', link => { return link.target.y; });
        });
    
        let linkElements = graph.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(self.links)
            .enter().append('line');
    
        let nodeElements = graph.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(self.nodes)
            .enter().append('circle')
            .attr('r', 12)
            .on('dblclick', dblclick)
            .call(drag);
    
        setTimeout(forceSimulation.force('link').links, 400, self.links);
    }

    function dragstart(node) {
        node.fx = node.x;
        node.fy = node.y;
        d3.select(this).style('fill', 'hsl(350, 71%, 86%)');
    }

    function dblclick(node) {
        if (!d3.event.active)
            forceSimulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
        d3.select(this).style('fill', 'hsl(50, 65%, 75%)');
    }

    return{
        createView
    }
};