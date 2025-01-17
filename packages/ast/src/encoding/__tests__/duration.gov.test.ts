import { getNestedProto } from '@subql/x-cosmology-utils';
import { defaultTelescopeOptions } from '@subql/x-cosmology-types';
import { expectCode, getTestProtoStore } from '../../../test-utils/'
import { AminoParseContext, ProtoParseContext } from '../context';
import { createAminoConverter, makeAminoTypeInterface } from '../amino/index';
import { createProtoType } from '../proto';
import { createObjectWithMethods } from '../object';

const store = getTestProtoStore();
store.traverseAll();

describe('Duraation: duration', () => {
    const ref = store.findProto('cosmos/gov/v1beta1/gov.proto');
    const context = new ProtoParseContext(ref, store, defaultTelescopeOptions);
    const aminoCtx = new AminoParseContext(ref, store, defaultTelescopeOptions);
    context.options.prototypes.typingsFormat.duration = 'duration'
    context.options.aminoEncoding.useLegacyInlineEncoding = true;
    aminoCtx.options.prototypes.typingsFormat.duration = 'duration';
    aminoCtx.options.aminoEncoding.useLegacyInlineEncoding = true;

    it('DepositParams', () => {
        expectCode(createObjectWithMethods(context, 'DepositParams',
            getNestedProto(ref.traversed).DepositParams
        ));
    });
});

describe('Duration: string', () => {
    const ref = store.findProto('cosmos/gov/v1beta1/gov.proto');
    const context = new ProtoParseContext(ref, store, defaultTelescopeOptions);
    const aminoCtx = new AminoParseContext(ref, store, defaultTelescopeOptions);
    context.options.prototypes.typingsFormat.duration = 'string';
    context.options.aminoEncoding.useLegacyInlineEncoding = true;
    aminoCtx.options.prototypes.typingsFormat.duration = 'string';
    aminoCtx.options.aminoEncoding.useLegacyInlineEncoding = true;

    it('DepositParams', () => {
        expectCode(createObjectWithMethods(context, 'DepositParams',
            getNestedProto(ref.traversed).DepositParams
        ));
    });
});