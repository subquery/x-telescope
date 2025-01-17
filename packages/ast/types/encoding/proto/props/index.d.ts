import * as t from '@babel/types';
import { ProtoParseContext } from '../../context';
import { ProtoType } from '@subql/x-cosmology-types';
export declare const createTypeUrlProperty: (context: ProtoParseContext, proto: ProtoType) => t.ObjectProperty;
export declare const createAminoTypeProperty: (context: ProtoParseContext, proto: ProtoType) => t.ObjectProperty;
