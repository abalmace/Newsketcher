function Dpr(points, tolerance)
{
	this.points = points || {};
	this.tolerance = tolerance || {}
}

Dpr.prototype.get = function()
{		
	return this.DouglasPeuckerReduction(this.points, this.tolerance)
}

/// <summary>
/// Uses the Douglas Peucker algorithim to reduce the number of points.
/// </summary>
/// <param name="Points">The points.</param>
/// <param name="Tolerance">The tolerance.</param>
/// <returns></returns>

Dpr.prototype.DouglasPeuckerReduction =  function(points,tolerance)
{
	
	if(points.length < 3 )
		return points;

	var firstPoint = 0;
	var	lastPoint = points.length - 1;
	this.pointIndexsToKeep = [];

	//Add the first and last index to the keepers
	this.pointIndexsToKeep.push(firstPoint);
	this.pointIndexsToKeep.push(lastPoint);


	//The first and the last point can not be the same
	while(points[firstPoint] == points[lastPoint])
	{
		lastPoint--
	}

	this.DouglasPeuckerReduction2(points, firstPoint, lastPoint, tolerance, this.pointIndexsToKeep);

	var returnPoints = [];
	this.pointIndexsToKeep.sort(function (a,b)
	{
		return a-b
	});
	for(var key in this.pointIndexsToKeep)
	{
		returnPoints.push(points[this.pointIndexsToKeep[key]])
	}

	return returnPoints
}

/// <summary>
/// Douglases the peucker reduction.
/// </summary>
/// <param name="points">The points.</param>
/// <param name="firstPoint">The first point.</param>
/// <param name="lastPoint">The last point.</param>
/// <param name="tolerance">The tolerance.</param>
/// <param name="pointIndexsToKeep">The point indexs to keep.</param>
Dpr.prototype.DouglasPeuckerReduction2 = function(points,firstPoint,lastPoint,tolerance,pointIndexsToKeep)
{
	var maxDistance = 0;
	var indexFarthest = 0;

	for (var index = firstPoint; index < lastPoint; index++)
	{
		var distance = this.PerpendicularDistance(points[firstPoint], points[lastPoint], points[index]);
		if (distance > maxDistance)
		{
		    maxDistance = distance;
		    indexFarthest = index
		}
	}

	if (maxDistance > tolerance && indexFarthest != 0)
	{
		//Add the largest point that exceeds the tolerance
		this.pointIndexsToKeep.push(indexFarthest);

		this.DouglasPeuckerReduction2(points, firstPoint, indexFarthest, tolerance, this.pointIndexsToKeep);
		this.DouglasPeuckerReduction2(points, indexFarthest, lastPoint, tolerance, this.pointIndexsToKeep)
	}
}

/// <summary>
/// The distance of a point from a line made from point1 and point2.
/// </summary>
/// <param name="pt1">The PT1.</param>
/// <param name="pt2">The PT2.</param>
/// <param name="p">The p.</param>
/// <returns></returns>
Dpr.prototype.PerpendicularDistance = function(point1, point2, point)
{
	var area = Math.abs(.5 * (point1.longitude * point2.latitude + point2.longitude * point.latitude + point.longitude * point1.latitude - point2.longitude * point1.latitude - point.longitude * point2.latitude - point1.longitude * point.latitude));
	var bottom = Math.sqrt(Math.pow(point1.longitude - point2.longitude, 2) + Math.pow(point1.latitude - point2.latitude, 2));
	var height = area / bottom * 2;

	return height;
}

