import * as t from '@babel/types';
import { ProtoType } from '@subql/x-cosmology-types';
import { fromPartialMethod } from './proto/from-partial';
import { decodeMethod } from './proto/decode';
import { encodeMethod } from './proto/encode';
import { fromJSONMethod } from './proto/from-json';
import { toJSONMethod } from './proto/to-json';
import { fromAminoJSONMethod, fromAminoMsgMethod } from './proto/from-amino';
import { toAminoJSONMethod, toAminoMsgMethod } from './proto/to-amino';
import { toSDKMethod } from './proto/to-sdk';
import { fromSDKMethod } from './proto/from-sdk';
import { ProtoParseContext } from './context';
import { createAminoTypeProperty, createTypeUrlProperty, fromProtoMsgMethod, fromSDKJSONMethod, toProtoMethod, toProtoMsgMethod } from './proto';
import { isMethod } from './proto/is';
import { getAminoFieldName, getSdkFieldName } from '../utils';
import { getAminoTypeName, getTypeUrl } from '@subql/x-cosmology-utils';

export const createObjectWithMethods = (
    context: ProtoParseContext,
    name: string,
    proto: ProtoType
) => {

    const methodsAndProps = [
        ( context.pluginValue('prototypes.addTypeUrlToObjects') || context.pluginValue('interfaces.enabled') && context.pluginValue('interfaces.useGlobalDecoderRegistry') ) && createTypeUrlProperty(context, proto),
        ( context.pluginValue('prototypes.addAminoTypeToObjects') || context.pluginValue('interfaces.enabled') && context.pluginValue('interfaces.useGlobalDecoderRegistry') ) && createAminoTypeProperty(context, proto),
        context.pluginValue('interfaces.enabled') && context.pluginValue('interfaces.useGlobalDecoderRegistry') && isMethod({context, name, proto}),
        context.pluginValue('interfaces.enabled') && context.pluginValue('interfaces.useGlobalDecoderRegistry') && context.pluginValue('useSDKTypes') && isMethod({context, name, proto, methodName: "isSDK", getFieldName: getSdkFieldName}),
        context.pluginValue('interfaces.enabled') && context.pluginValue('interfaces.useGlobalDecoderRegistry') && context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') && isMethod({context, name, proto, methodName: "isAmino", getFieldName: getAminoFieldName}),
        context.pluginValue('prototypes.methods.encode') && encodeMethod(context, name, proto),
        context.pluginValue('prototypes.methods.decode') && decodeMethod(context, name, proto),
        context.pluginValue('prototypes.methods.fromJSON') && fromJSONMethod(context, name, proto),
        context.pluginValue('prototypes.methods.toJSON') && toJSONMethod(context, name, proto),
        context.pluginValue('prototypes.methods.fromPartial') && fromPartialMethod(context, name, proto),
        context.pluginValue('prototypes.methods.fromSDK') && fromSDKMethod(context, name, proto),
        context.pluginValue('prototypes.methods.fromSDKJSON') && fromSDKJSONMethod(context, name, proto),
        context.pluginValue('prototypes.methods.toSDK') && toSDKMethod(context, name, proto),
        (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.fromAmino')) && fromAminoJSONMethod(context, name, proto),
        (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.toAmino')) && toAminoJSONMethod(context, name, proto),
        !context.pluginValue('aminoEncoding.disableMsgTypes') && (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.fromAmino')) && fromAminoMsgMethod(context, name, proto),
        !context.pluginValue('aminoEncoding.disableMsgTypes') && (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.toAmino')) && toAminoMsgMethod(context, name, proto),
        (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.fromProto')) && fromProtoMsgMethod(context, name, proto),
        (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.toProto')) && toProtoMethod(context, name, proto),
        (context.pluginValue('aminoEncoding.enabled') && !context.pluginValue('aminoEncoding.useLegacyInlineEncoding') || context.pluginValue('prototypes.methods.toProto')) && toProtoMsgMethod(context, name, proto),
    ].filter(Boolean);

    return t.exportNamedDeclaration(
        t.variableDeclaration('const',
            [
                t.variableDeclarator(
                    t.identifier(name),
                    t.objectExpression(
                        methodsAndProps
                    )
                )
            ]
        )
    )
};

export const createRegisterObject = (
  context: ProtoParseContext,
  name: string,
  proto: ProtoType,
) => {
  if (name === 'Any') {
    return;
  }

  context.addUtil("GlobalDecoderRegistry");

  const typeUrl = getTypeUrl(context.ref.proto, proto);
  if (!typeUrl) return;

  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier("GlobalDecoderRegistry"),
        t.identifier("register")
      ),
      [
        t.memberExpression(t.identifier(name), t.identifier("typeUrl")),
        t.identifier(name),
      ]
    )
  );
};

export const createRegisterAminoProtoMapping = (
  context: ProtoParseContext,
  name: string,
  proto: ProtoType,
) => {
  context.addUtil("GlobalDecoderRegistry");

  const str = getAminoTypeName(context, context.ref.proto, proto);
  if (!str || str.startsWith('/')) return;

  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(
        t.identifier("GlobalDecoderRegistry"),
        t.identifier("registerAminoProtoMapping")
      ),
      [
        t.memberExpression(t.identifier(name), t.identifier("aminoType")),
        t.memberExpression(t.identifier(name), t.identifier("typeUrl")),
      ]
    )
  );
};