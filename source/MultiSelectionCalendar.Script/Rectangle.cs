namespace MultiSelectionCalendar
{
	public class Position
	{
		public int X { get; set; }
		public int Y { get; set; }

		public Position(int x, int y)
		{
			X = x;
			Y = y;
		}
	}


	public class Rectangle
	{
		public int Top { get; set; }
		public int Right { get; set; }
		public int Bottom { get; set; }
		public int Left { get; set; }

		public int Width { get { return Right - Left; } }
		public int Height { get { return Bottom - Top; } }

		public Rectangle(int top, int right, int bottom, int left)
		{
			Top = top;
			Right = right;
			Bottom = bottom;
			Left = left;
		}

		public bool IsInside(Position position)
		{
			return
				position.X >= Left
				&& position.X <= Right
				&& position.Y >= Top
				&& position.Y <= Bottom;
		}
	}
}
