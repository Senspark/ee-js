export class Polygon {
    /** All vertices of the polygon. */
    private vertices: cc.Vec2[] = [];

    /** The calculated AABB, maybe undefined if not calculated. */
    private aabb?: cc.Rect;

    /** Gets the polygon vertices. */
    public getVertices(): cc.Vec2[] {
        return this.vertices;
    };

    /**
     * Sets the polygon vertices.
     * @param vertices Array of vertices to assign.
     * @return Instance to this for method chaining.
     */
    public setVertices(vertices: cc.Vec2[]): this {
        this.vertices = vertices;
        this.aabb = undefined;
        return this;
    };

    /**
     * Adds a single vertex.
     * @param vertex The vertex to be added.
     * @return Instance to this for method chaining.
     */
    public addVertex(vertex: cc.Vec2): this {
        this.vertices.push(vertex);
        if (this.aabb !== undefined /* Calculated, we need to update it */) {
            if (vertex.x < this.aabb.xMin) {
                this.aabb.xMin = vertex.x;
            } else if (vertex.x > this.aabb.xMax) {
                this.aabb.xMax = vertex.x;
            }
            if (vertex.y < this.aabb.yMin) {
                this.aabb.yMin = vertex.y;
            } else if (vertex.y > this.aabb.yMax) {
                this.aabb.yMax = vertex.y;
            }
        }
        return this;
    };

    /** Gets AABB. */
    public getAABB(): cc.Rect {
        this.updateAABB();
        return this.aabb!;
    };

    /**
     * Transforms this polygon and returns a new copy.
     * @return The transformed polygon.
     */
    public transform(transform: cc.AffineTransform): Polygon {
        let transformVertices = this.vertices.map(p => cc.pointApplyAffineTransform(p, transform));
        return new Polygon().setVertices(transformVertices);
    };

    /**
     * Tests whether this polygon collides with another polygon.
     * @param polygon The polygon to test collision with.
     * @return True if there is a collision, false otherwise.
     */
    public collides(polygon: Polygon): boolean {
        if (!cc.Intersection.rectRect(this.getAABB(), polygon.getAABB())) {
            return false;
        }
        return cc.Intersection.polygonPolygon(this.getVertices(), polygon.getVertices());
    };

    private updateAABB(): void {
        if (this.aabb !== undefined) {
            return;
        }
        this.aabb = this.calculateAABB(this.vertices);
    };

    private calculateAABB(vertices: cc.Vec2[]): cc.Rect {
        let xs = vertices.map(p => p.x);
        let ys = vertices.map(p => p.y);
        let minX = Math.min(...xs);
        let maxX = Math.max(...xs);
        let minY = Math.min(...ys);
        let maxY = Math.max(...ys);
        return cc.rect(minX, minY, maxX - minX, maxY - minY);
    };

    public getSquareMinDistanceToPoint(p: cc.Vec2): number {
        let rect = this.getAABB();
        let DeltaX = p.x - Math.max(rect.origin.x, Math.min(p.x, rect.origin.x + rect.size.width));
        let DeltaY = p.y - Math.max(rect.origin.y, Math.min(p.y, rect.origin.y + rect.size.height));
        return (DeltaX * DeltaX + DeltaY * DeltaY);
    }
};