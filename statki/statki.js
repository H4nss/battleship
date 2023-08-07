window.onload = start;

var fields = new Array(6);
var isClicked = new Array(6);

var shotCounter = 0;
var hitShots = 0;
var lock = false;

for(i = 0; i < 6; i++)
{
	fields[i] = new Array(6);

	for(j = 0; j < 6; j++)
	{
		fields[i][j] = "nothing";
	}
}

for(i = 0; i < 6; i++)
{
	isClicked[i] = new Array(6);

	for(j = 0; j < 6; j++)
	{
		isClicked[i][j] = 0;
	}
}

function getRandomNumber(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start()
{
	
	var content = "";
	
	for (i = 0; i < 36; i++)
	{
		var element = "field" + i;
		content = content + '<div class = "field" id="'+ element + '"></div>';
		if ((i + 1) % 6 == 0) content = content + '<div style="clear:both;"> </div>';
	}
	
    $('#board').html(content);

	for (var i = 0; i < 36; i++) 
	{
		var X = i % 6;
    	var Y = 0;

    	for(j = 1; j <= i; j++) 
		{
       	 	if((j % 6) == 0) Y++;
    	}

		$("#field" + i).on("click", eventDelay(Y, X));
	}

	drawBigShip();
	drawMediumShip();
	drawMediumShip();
	drawSmallShip();
	drawSmallShip();
	drawSmallShip();
	//show();
}

function drawBigShip()
{
	var bigX = getRandomNumber(0, 5);
	var bigY = getRandomNumber(0, 5);
	var horizontally = getRandomNumber(0, 1);

	if(horizontally == 1)
	{
		if(bigX <= 3)
		{
			for(i = bigX; i < (bigX + 3); i++)
			{
				fields[bigY][i] = "big";
			}
		}
		else 
		{
			for(i = bigX; i > (bigX - 3); i--)
			{
				fields[bigY][i] = "big";
			}
		}
	}
	else
	{
		if(bigY <= 3)
		{
			for(i = bigY; i < (bigY + 3); i++)
			{
				fields[i][bigY] = "big";
			}
		}
		else 
		{
			for(i = bigY; i > (bigY - 3); i--)
			{
				fields[i][bigY] = "big";
			}
		}
	}
}

function drawMediumShip()
{
	var mediumX1 = getRandomNumber(0, 5);
	var mediumY1 = getRandomNumber(0, 5);
	var mediumX2 = 0;
	var mediumY2 = 0;
	var whichSide = getRandomNumber(1, 4);

	for(i = 0; i < 6; i++)
	{
		for(j = 0; j < 6; j++)
		{
			if(fields[i][j] == "big")
			{
				mediumY2 = i;
				mediumX2 = j;
			}
		}
	}

	while (fields[mediumY1][mediumX1] != "nothing") 
	{
		var mediumX1 = getRandomNumber(0, 5);
		var mediumY1 = getRandomNumber(0, 5);
	}

	while (fields[mediumY2][mediumX2] != "nothing") 
	{
		switch (whichSide) 
		{
			case 1:
				if(mediumY1 + 1 <= 5)
				{
					mediumX2 = mediumX1;
					mediumY2 = mediumY1 + 1;
				}
			  	break;
			case 2:
				if(mediumY1 - 1 >= 0)
				{
					mediumX2 = mediumX1;
					mediumY2 = mediumY1 - 1;
				}
			  	break;
			case 3:
				if(mediumX1 + 1 <= 5)
				{
					mediumX2 = mediumX1 + 1;
					mediumY2 = mediumY1;
				}
			  	break;
			case 4:
				if(mediumX1 - 1 >= 0)
				{
					mediumX2 = mediumX1 - 1;
					mediumY2 = mediumY1;
				}
			  	break;
		}

		var whichSide = getRandomNumber(1, 4);
	}

	fields[mediumY1][mediumX1] = "medium";
	fields[mediumY2][mediumX2] = "medium";
}

function drawSmallShip()
{
	var smallX = getRandomNumber(0, 5);
	var smallY = getRandomNumber(0, 5);

	while (fields[smallY][smallX] != "nothing") 
	{
		var smallX = getRandomNumber(0, 5);
		var smallY = getRandomNumber(0, 5);
	}

	fields[smallY][smallX] = "small";
}

function eventDelay(Y, X) 
{
    return function() { shot(Y, X); };
}

function shot( Y, X) 
{
	var picture1 = "url(img/good.png)";
	var picture2 = "url(img/wrong.png)";
	var j = 6 * Y + X;

	if(isClicked[Y][X] == 0 && lock == false)
	{
		shotCounter++;

		if(fields[Y][X] == "nothing")
		{
			$('#field'+ j).css('background-image', picture2);
			$('#field'+ j).css('filter', 'brightness(100%)');
			$('#result').html('Mishit!');
			isClicked[Y][X] = 1;
		}
		else
		{
			$('#field'+ j).css('background-image', picture1);
			$('#field'+ j).css('filter', 'brightness(100%)');
			isClicked[Y][X] = 1;

			if(fields[Y][X] == "big")
			{
				$('#result').html('We got a big battleship!');
			}
			if(fields[Y][X] == "medium")
			{
				$('#result').html('We got a medium battleship!');
			}
			if(fields[Y][X] == "small")
			{
				$('#result').html('We got a small battleship!');
			}

			hitShots++;
		}

		$('#score').html('Shot counter: ' + shotCounter);

		if(hitShots >= 10) win();
	}
}

function win()
{
	lock = true;
	var title = "BEGINNER";

	if(shotCounter < 16 && shotCounter >= 0) title = "LEGEND";
	if(shotCounter < 22 && shotCounter >= 16) title = "HUNTER";
	if(shotCounter < 28 && shotCounter >= 22) title = "EXPERIENCED";

	$('#right').html("Great! You have destroyed all enemy ships. <br /> <br /> Your level is " + title + '<br /> <br /><span class = "replay" onclick = "location.reload()"> Replay?</ span>');
}

function show()
{
	var k = 0;
	var picture1 = "url(img/big.png)";
	var picture2 = "url(img/medium.png)";
	var picture3 = "url(img/small.png)";

	for(i = 0; i < 6; i++)
	{
		for(j = 0; j < 6; j++)
		{
			if(fields[i][j] == "big")
			{
				$('#field'+ k).css('background-image', picture1);
			}

			if(fields[i][j] == "medium")
			{
				$('#field'+ k).css('background-image', picture2);
			}

			if(fields[i][j] == "small")
			{
				$('#field'+ k).css('background-image', picture3);
			}

			k++;
		}
	}
}

