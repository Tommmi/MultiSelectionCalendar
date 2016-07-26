(function() {
	'use strict';
	var $asm = {};
	global.Saltarelle = global.Saltarelle || {};
	global.Saltarelle.Utils = global.Saltarelle.Utils || {};
	ss.initAssembly($asm, 'Saltarelle.Utils');
	////////////////////////////////////////////////////////////////////////////////
	// Saltarelle.Utils.DateTimeExtension
	var $Saltarelle_Utils_DateTimeExtension = function() {
	};
	$Saltarelle_Utils_DateTimeExtension.__typeName = 'Saltarelle.Utils.DateTimeExtension';
	$Saltarelle_Utils_DateTimeExtension.addDaysSafe = function(date, days) {
		// due to summer time change !!
		var newDate;
		if (days > 0) {
			var $t1 = new Date((new Date(date.getFullYear(), date.getMonth(), date.getDate())).valueOf() + Math.round((days * 24 + 1) * 3600000));
			newDate = new Date($t1.getFullYear(), $t1.getMonth(), $t1.getDate());
		}
		else if (days < 0) {
			var $t2 = new Date((new Date(date.getFullYear(), date.getMonth(), date.getDate())).valueOf() + Math.round(days * 24 * 3600000));
			newDate = new Date($t2.getFullYear(), $t2.getMonth(), $t2.getDate());
		}
		else {
			newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		}
		return new Date(newDate.getFullYear(), newDate.getMonth() + 1 - 1, newDate.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
	};
	global.Saltarelle.Utils.DateTimeExtension = $Saltarelle_Utils_DateTimeExtension;
	////////////////////////////////////////////////////////////////////////////////
	// Saltarelle.Utils.jQueryEventMouseWheel
	var $Saltarelle_Utils_jQueryEventMouseWheel = function() {
	};
	$Saltarelle_Utils_jQueryEventMouseWheel.__typeName = 'Saltarelle.Utils.jQueryEventMouseWheel';
	global.Saltarelle.Utils.jQueryEventMouseWheel = $Saltarelle_Utils_jQueryEventMouseWheel;
	////////////////////////////////////////////////////////////////////////////////
	// Saltarelle.Utils.StaticReflection
	var $Saltarelle_Utils_StaticReflection = function() {
	};
	$Saltarelle_Utils_StaticReflection.__typeName = 'Saltarelle.Utils.StaticReflection';
	$Saltarelle_Utils_StaticReflection.getMemberName$4 = function(T, TMemberType) {
		return function(instance, expression) {
			return $Saltarelle_Utils_StaticReflection.getMemberName$2(T, TMemberType).call(null, expression);
		};
	};
	$Saltarelle_Utils_StaticReflection.getMemberName$2 = function(T, TMemberType) {
		return function(expression) {
			if (ss.isNullOrUndefined(expression)) {
				throw new ss.ArgumentException('The expression cannot be null.');
			}
			return $Saltarelle_Utils_StaticReflection.$getMemberName(expression.body);
		};
	};
	$Saltarelle_Utils_StaticReflection.getMemberName$3 = function(T) {
		return function(instance, expression) {
			return $Saltarelle_Utils_StaticReflection.getMemberName(T).call(null, expression);
		};
	};
	$Saltarelle_Utils_StaticReflection.getMemberName = function(T) {
		return function(expression) {
			if (ss.isNullOrUndefined(expression)) {
				throw new ss.ArgumentException('The expression cannot be null.');
			}
			return $Saltarelle_Utils_StaticReflection.$getMemberName(expression.body);
		};
	};
	$Saltarelle_Utils_StaticReflection.getMemberName$1 = function(T) {
		return function(staticMember) {
			return $Saltarelle_Utils_StaticReflection.$getMemberName(staticMember);
		};
	};
	$Saltarelle_Utils_StaticReflection.$getMemberName = function(expression) {
		if (ss.isNullOrUndefined(expression)) {
			throw new ss.ArgumentException('The expression cannot be null.');
		}
		var expression1 = ss.safeCast(expression, ss.isValue(expression) && expression.ntype === 23);
		if (ss.isValue(expression1)) {
			// Reference type property or field
			var memberExpression = expression1;
			return memberExpression.member.name;
		}
		var callExpression = ss.safeCast(expression, ss.isValue(expression) && expression.ntype === 6);
		if (ss.isValue(callExpression)) {
			// Reference type method
			var methodCallExpression = callExpression;
			return methodCallExpression.method.name;
		}
		var unaryExpression1 = ss.safeCast(expression, ss.isValue(expression) && [4, 10, 11, 28, 29, 30, 34, 40, 44, 49, 54, 60, 62, 77, 78, 79, 80, 82, 83, 84].indexOf(expression.ntype) >= 0);
		if (ss.isValue(unaryExpression1)) {
			// Property, field of method returning value type
			var unaryExpression = unaryExpression1;
			return $Saltarelle_Utils_StaticReflection.$getMemberName$1(unaryExpression);
		}
		var lambdaExpression1 = ss.safeCast(expression, ss.isValue(expression) && expression.ntype === 18);
		if (ss.isValue(lambdaExpression1)) {
			// Property, field of method returning value type
			var lambdaExpression = lambdaExpression1;
			return $Saltarelle_Utils_StaticReflection.$getMemberName(lambdaExpression.body);
		}
		throw new ss.ArgumentException('Invalid expression');
	};
	$Saltarelle_Utils_StaticReflection.$getMemberName$1 = function(unaryExpression) {
		var operand = ss.safeCast(unaryExpression.operand, ss.isValue(unaryExpression.operand) && unaryExpression.operand.ntype === 6);
		if (ss.isValue(operand)) {
			var methodExpression = operand;
			return methodExpression.method.name;
		}
		return ss.cast(unaryExpression.operand, ss.isValue(unaryExpression.operand) && unaryExpression.operand.ntype === 23).member.name;
	};
	$Saltarelle_Utils_StaticReflection.hookSetterOfProperty = function(TObjectType, TMemberType) {
		return function(obj, propertySelector, onSetProperty) {
			var propertyName = $Saltarelle_Utils_StaticReflection.getMemberName$2(TObjectType, TMemberType).call(null, propertySelector);
			var firstChar = String.fromCharCode(propertyName.charCodeAt(0)).toLowerCase();
			if (propertyName.length > 1) {
				propertyName = firstChar + propertyName.substring(1);
			}
			else {
				propertyName = firstChar;
			}
			(function() {
				var oldProperty = obj[propertyName];
				Object.defineProperty(obj, propertyName, {
					get: function() {
						return oldProperty;
					},
					set: function(value) {
						oldProperty = value;
						onSetProperty(value);
					}
				});
			})();
		};
	};
	global.Saltarelle.Utils.StaticReflection = $Saltarelle_Utils_StaticReflection;
	////////////////////////////////////////////////////////////////////////////////
	// Saltarelle.Utils.Utils
	var $Saltarelle_Utils_Utils = function() {
	};
	$Saltarelle_Utils_Utils.__typeName = 'Saltarelle.Utils.Utils';
	$Saltarelle_Utils_Utils.enhance = function(TDestType, TSrcType) {
		return function(src) {
			return $Saltarelle_Utils_Utils.enhance$1(TDestType, TSrcType).call(null, src, function() {
				return ss.createInstance(TDestType);
			});
		};
	};
	$Saltarelle_Utils_Utils.enhance$1 = function(TDestType, TSrcType) {
		return function(src, createDefault) {
			$.extend(src, createDefault());
			return src;
		};
	};
	$Saltarelle_Utils_Utils.watchProperty = function(TScopeType, TPropertyType) {
		return function(scope, propertySelector, handler) {
			var propertyName = $Saltarelle_Utils_StaticReflection.getMemberName$4(TScopeType, TPropertyType).call(null, scope, propertySelector);
			scope.$watch(propertyName, handler);
		};
	};
	$Saltarelle_Utils_Utils.watchPropertyCollection = function(TScopeType, TPropertyType) {
		return function(scope, propertySelector, handler) {
			var propertyName = $Saltarelle_Utils_StaticReflection.getMemberName$4(TScopeType, TPropertyType).call(null, scope, propertySelector);
			scope.$watchCollection(propertyName, handler);
		};
	};
	global.Saltarelle.Utils.Utils = $Saltarelle_Utils_Utils;
	ss.initClass($Saltarelle_Utils_DateTimeExtension, $asm, {});
	ss.initClass($Saltarelle_Utils_jQueryEventMouseWheel, $asm, {});
	ss.initClass($Saltarelle_Utils_StaticReflection, $asm, {});
	ss.initClass($Saltarelle_Utils_Utils, $asm, {});
})();
