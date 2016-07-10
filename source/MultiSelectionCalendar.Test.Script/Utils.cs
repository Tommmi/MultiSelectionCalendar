using System;
using System.Collections;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using AngularJS;
using jQueryApi;

namespace MultiSelectionCalendar.Test.Script
{
	public static class Utils
	{
		/// <summary>
		/// Makes flat reference copies of all members from class TDestType to object src.
		/// So the JavaScript object src will know thows new members.
		/// Casts src to type TDestType, so all changes of returned value will have affect to 
		/// passed object src.
		/// "Enhance" will also copy prototype members to src.
		/// </summary>
		/// <typeparam name="TDestType">
		/// Must be directly derived from TSrcType.
		/// Must have Default constructor
		/// </typeparam>
		/// <typeparam name="TSrcType"></typeparam>
		/// <param name="src">
		/// The object which will get new members by this method call
		/// </param>
		/// <returns>src enhanced by new members</returns>
		public static TDestType Enhance<TDestType, TSrcType>(TSrcType src)
			where TDestType : class, TSrcType, new()
			where TSrcType : class
		{
			return Enhance(src, () => new TDestType());
		}

		/// <summary>
		/// Makes flat reference copies of all members from class TDestType to object src.
		/// So the JavaScript object src will know thows new members.
		/// Casts src to type TDestType, so all changes of returned value will have affect to 
		/// passed object src.
		/// "Enhance" will also copy prototype members to src.
		/// </summary>
		/// <typeparam name="TDestType">
		/// Must be directly derived from TSrcType.
		/// Must have Default constructor
		/// </typeparam>
		/// <typeparam name="TSrcType"></typeparam>
		/// <param name="src">
		/// The object which will get new members by this method call
		/// </param>
		/// <param name="createDefault">
		/// creator delegate for TDestType
		/// </param>
		/// <returns>src enhanced by new members</returns>
		public static TDestType Enhance<TDestType, TSrcType>(TSrcType src, Func<TDestType> createDefault)
			where TDestType : class, TSrcType
			where TSrcType : class
		{
			jQuery.ExtendObject(src, createDefault());
			return UnsafeSafeCast<TDestType>(src);
		}

		/// <summary>
		/// Casts an object to the given type without any validation
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="obj"></param>
		/// <returns></returns>
		[InlineCode("{obj}")]
		public static T UnsafeSafeCast<T>(object obj)
			where T : class
		{
			return null;
		}

		public static void WatchProperty<TScopeType, T>(
			this TScopeType scope,
			Expression<Func<TScopeType, T>> propertySelector,
			WatchListener<T> handler)
			where TScopeType : Scope
		{
			var propertyName = scope.GetMemberName(propertySelector);
			scope.Watch(propertyName, handler);
		}
		public static void WatchPropertyCollection<TScopeType, T>(
			this TScopeType scope,
			Expression<Func<TScopeType, T>> propertySelector,
			WatchListener<T> handler)
			where TScopeType : Scope
			where T: IEnumerable
		{
			var propertyName = scope.GetMemberName(propertySelector);
			scope.WatchCollection(propertyName, handler);
		}
	}
}
