import { makeAminoTypeInterface } from './index';
import { ProtoStore } from '@subql/x-cosmology-proto-parser'
import { snake } from 'case';
import { camel } from '@subql/x-cosmology-utils';
import { prepareContext, expectCode, printCode, getTestProtoStore } from '../../../../test-utils';
const store = getTestProtoStore();

store.traverseAll();

describe('osmosis/gamm/v1beta1/tx', () => {

    const {
        context, protos
    } = prepareContext(store, 'osmosis/gamm/v1beta1/tx.proto')

    it('Interfaces', () => {
        context.options.aminoEncoding.casingFn = camel;
        context.options.aminoEncoding.useLegacyInlineEncoding = true;
        expectCode(makeAminoTypeInterface(
            {
                context,
                proto: protos.find(p => p.name === 'MsgJoinPool'),
            }
        ))
    })
});


describe('cosmos/staking/v1beta1/tx', () => {
    const {
        context, protos
    } = prepareContext(store, 'cosmos/staking/v1beta1/tx.proto')

    it('MsgCreateValidator', () => {
        context.options.aminoEncoding.casingFn = snake;

        expectCode(makeAminoTypeInterface(
            {
                context,
                proto: protos.find(p => p.name === 'MsgCreateValidator'),
            }
        ))
    })
    it('MsgEditValidator', () => {
        context.options.aminoEncoding.casingFn = snake;
        expectCode(makeAminoTypeInterface(
            {
                context,
                proto: protos.find(p => p.name === 'MsgEditValidator'),
            }
        ))
    })
    it('MsgUndelegate', () => {
        context.options.aminoEncoding.casingFn = snake;
        expectCode(makeAminoTypeInterface(
            {
                context,
                proto: protos.find(p => p.name === 'MsgUndelegate'),
            }
        ))
    })
});

