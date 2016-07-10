using System;
using System.Linq.Expressions;

// ReSharper disable UnusedMember.Global
// ReSharper disable MemberCanBePrivate.Global

namespace MultiSelectionCalendar.Test.Script
{
	public static class StaticReflection
	{
		public static string GetMemberName<T, TMemberType>(
			// ReSharper disable once UnusedParameter.Global
			this T instance,
			Expression<Func<T, TMemberType>> expression)
		{
			return GetMemberName(expression);
		}

		public static string GetMemberName<T, TMemberType>(
			Expression<Func<T, TMemberType>> expression)
		{
			if (expression == null)
			{
				throw new ArgumentException(
					"The expression cannot be null.");
			}

			return GetMemberName(expression.Body);
		}

		public static string GetMemberName<T>(
			// ReSharper disable once UnusedParameter.Global
			this T instance,
			Expression<Action<T>> expression)
		{
			return GetMemberName(expression);
		}

		public static string GetMemberName<T>(
			Expression<Action<T>> expression)
		{
			if (expression == null)
			{
				throw new ArgumentException(
					"The expression cannot be null.");
			}

			return GetMemberName(expression.Body);
		}

		public static string GetMemberName<T>(this Expression<Func<T>> staticMember)
		{
			return GetMemberName((Expression)staticMember);
		}

		private static string GetMemberName(
			Expression expression)
		{
			if (expression == null)
			{
				throw new ArgumentException(
					"The expression cannot be null.");
			}

			var expression1 = expression as MemberExpression;
			if (expression1 != null)
			{
				// Reference type property or field
				var memberExpression =
					expression1;
				return memberExpression.Member.Name;
			}

			var callExpression = expression as MethodCallExpression;
			if (callExpression != null)
			{
				// Reference type method
				var methodCallExpression =
					callExpression;
				return methodCallExpression.Method.Name;
			}

			var unaryExpression1 = expression as UnaryExpression;
			if (unaryExpression1 != null)
			{
				// Property, field of method returning value type
				var unaryExpression = unaryExpression1;
				return GetMemberName(unaryExpression);
			}

			var lambdaExpression1 = expression as LambdaExpression;
			if (lambdaExpression1 != null)
			{
				// Property, field of method returning value type
				var lambdaExpression = lambdaExpression1;
				return GetMemberName(lambdaExpression.Body);
			}


			throw new ArgumentException("Invalid expression");
		}

		private static string GetMemberName(
			UnaryExpression unaryExpression)
		{
			var operand = unaryExpression.Operand as MethodCallExpression;
			if (operand != null)
			{
				var methodExpression =
					operand;
				return methodExpression.Method.Name;
			}

			return ((MemberExpression)unaryExpression.Operand)
				.Member.Name;
		}
	}
}
